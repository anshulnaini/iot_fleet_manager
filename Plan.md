Build Strategy (Stage-1)
Phase 0 — Skeleton & DB (10–30 min)

Goal: Have Docker + Postgres up, and a backend server that returns /health: { ok: true }.

Create top-level files

docker-compose.yml (services: db, backend, frontend, sim—you can stub frontend/sim for now)

.gitignore, README.md

Backend minimal scaffold

services/backend/package.json

services/backend/tsconfig.json

services/backend/src/index.ts → Express app with:

GET /health → { ok: true }

services/backend/src/server.ts → create HTTP server, listen on PORT (4000)

Dockerize backend

services/backend/Dockerfile (node:20-alpine, install deps, copy src, npm run build, start)

Bring up DB + backend

docker compose up --build db backend
# test:
curl http://localhost:4000/health  # -> { "ok": true }


✅ Checkpoint A: Health endpoint works.

Phase 1 — Prisma Models & Migrations (30–45 min)

Goal: Define schema and create the database tables.

Add Prisma files

services/backend/prisma/schema.prisma with models:

Device, Telemetry, Rule, Alert (as in the plan)

services/backend/src/lib/db.ts → Prisma client singleton

Generate & migrate

docker compose exec backend npx prisma generate
docker compose exec backend npx prisma migrate dev --name init


Seed a default rule

services/backend/src/seed.ts → create a “High Temp > 30C” rule if not exists

docker compose exec backend node dist/seed.js  # or tsx src/seed.ts if using tsx


✅ Checkpoint B: Tables exist; a rule row is in DB.

Phase 2 — Ingestion API (HTTP) (45–60 min)

Goal: Accept telemetry JSON, validate, write to DB, update lastSeenAt.

Validation

services/backend/src/lib/validation.ts → Zod schema:

{ deviceId: string; timestamp?: string; metrics: { temperature_c?, humidity_pct?, battery_pct? }; extras? }

Route

services/backend/src/routes/ingest.ts

POST /api/ingest:

validate

upsert Device (lastSeenAt)

insert Telemetry row

return 202 { ok: true }

Wire route

In src/index.ts:

app.use(express.json())

app.use('/api/ingest', ingestRouter)

Test with curl

curl -X POST http://localhost:4000/api/ingest \
 -H 'content-type: application/json' \
 -d '{
  "deviceId":"dev-1",
  "metrics": { "temperature_c": 25.7, "humidity_pct": 48.1, "battery_pct": 97 }
}'
# Expect 202


Verify DB quickly (optional)

docker compose exec db psql -U iot -d iot -c "select id, deviceid, timestamp from \"Telemetry\" order by timestamp desc limit 3;"


✅ Checkpoint C: Manual POST creates telemetry & device entries.

Phase 3 — Rules & Alerts (30–45 min)

Goal: Trigger alerts on ingest when thresholds are crossed.

Rules evaluator

services/backend/src/lib/rules.ts:

load enabled rules

check telemetry value vs operator/value

create Alert rows when matched

Hook into ingest

After creating telemetry in ingest.ts: await evaluateRules(rec)

Alerts API

services/backend/src/routes/alerts.ts

GET /api/alerts?active=true → latest alerts

Test

# Send a high temp to trigger the seeded rule (> 30C)
curl -X POST http://localhost:4000/api/ingest \
 -H 'content-type: application/json' \
 -d '{"deviceId":"dev-1","metrics":{"temperature_c": 34}}'

curl http://localhost:4000/api/alerts?active=true
# Expect an alert with severity and message


✅ Checkpoint D: Alerts appear when threshold exceeded.

Phase 4 — WebSockets Broadcast (45–60 min)

Goal: Broadcast telemetry and alert events to clients.

WS helper

services/backend/src/lib/ws.ts:

setWSServer(wss) to register

broadcast({ type, payload }) to send JSON to all clients

Attach WS

In src/server.ts:

create WebSocketServer with path /live

call setWSServer(wss)

Broadcast in routes

After telemetry insert in ingest.ts: broadcast({ type: 'telemetry', payload: { deviceId, rec } })

After creating an alert in rules.ts: broadcast({ type: 'alert', payload: alert })

Test with a quick WS client (dev only)

Use a VS Code WebSocket plugin or a tiny Node snippet to connect to ws://localhost:4000/live and log messages, then POST telemetry and watch events arrive.

✅ Checkpoint E: Events flow over WS.

Phase 5 — Devices API (30–45 min)

Goal: List devices with their latest reading.

Route

services/backend/src/routes/devices.ts

GET /api/devices → list devices + join (or second query) for the most recent telemetry per device

GET /api/devices/:id → device + latest N telemetry

Test

curl http://localhost:4000/api/devices
curl http://localhost:4000/api/devices/dev-1


✅ Checkpoint F: Devices list and per-device detail APIs work.

Phase 6 — Frontend Minimal Pages (30–60 min)

Goal: Show devices & alerts; poll APIs first; add WS later.

Next.js scaffold

services/frontend/package.json, tsconfig.json, next.config.ts

services/frontend/app/layout.tsx, app/page.tsx

Devices page

services/frontend/app/devices/page.tsx

fetch from NEXT_PUBLIC_API_BASE/api/devices

render table: id, name, type, lastSeenAt, latest.temperature_c

Alerts page

services/frontend/app/alerts/page.tsx

fetch /api/alerts?active=true

render list

Run & test

docker compose up --build frontend
# visit http://localhost:3000/devices and /alerts


✅ Checkpoint G: You can see DB data in the UI.

Phase 7 — Live Updates in UI (30–45 min)

Goal: Visual updates without manual refresh.

Client WS hookup

Create a small client store (Zustand) in services/frontend/app/(or src)/live-store.ts

In layout.tsx or a LiveProvider client component, open new WebSocket(NEXT_PUBLIC_WS_URL) and push events into the store.

Use events

On devices/page.tsx, when receiving a telemetry event, optimistically update the displayed “latest temperature” for that device.

On alerts/page.tsx, prepend new alerts.

Test

Open devices page → POST a new telemetry with curl → see row update within a second or two.

✅ Checkpoint H: Live updates render in the browser.

Phase 8 — Simulator Service (15–30 min)

Goal: Automate telemetry traffic.

Simulator files

scripts/simulator/index.js (sends POST to /api/ingest for a list of deviceIds on a timer)

scripts/simulator/Dockerfile, package.json

Compose

In docker-compose.yml, service sim depends on backend, env:

TARGET_URL=http://backend:4000/api/ingest

DEVICES="dev-1,dev-2,dev-3,dev-4,dev-5"

PERIOD_MS=3000

Run

docker compose up -d sim


✅ Checkpoint I: Devices and alerts flow continuously.

Phase 9 — Observability & Smoke Tests (30–60 min)

Goal: Basic metrics and a couple of E2E checks.

Metrics

In backend src/index.ts, expose /metrics via prom-client default metrics.

Test: curl http://localhost:4000/metrics

Smoke tests (manual or tiny scripts)

“Ingest → appears in /api/devices”

“High temp → appears in /api/alerts?active=true”

“WS client receives telemetry + alert events”

What to Do When Stuck

500s on ingest → log Zod errors; verify JSON keys match telemetrySchema exactly.

No DB writes → check DATABASE_URL and that prisma migrate dev ran.

WS not firing → confirm server attaches WS at /live, and client URL matches NEXT_PUBLIC_WS_URL.

Frontend empty → hit backend API directly in the browser; if it works, check NEXT_PUBLIC_API_BASE.

Minimal “File Order” Checklist

docker-compose.yml

Backend bare minimum:

services/backend/package.json, tsconfig.json, src/index.ts, src/server.ts, Dockerfile

Prisma:

services/backend/prisma/schema.prisma, src/lib/db.ts, migrate + seed

Ingest route:

src/lib/validation.ts, src/routes/ingest.ts, wire in src/index.ts

Rules/alerts:

src/lib/rules.ts, src/routes/alerts.ts

WebSocket:

src/lib/ws.ts, set up in src/server.ts, broadcast in ingest/rules

Devices API:

src/routes/devices.ts

Frontend scaffold:

services/frontend/… (layout.tsx, page.tsx, devices/page.tsx, alerts/page.tsx)

Frontend WS LiveProvider (optional but recommended)

Simulator service

Build it in that order, test at every checkpoint, and you’ll always know the last thing that worked.