GEMINI.md — IoT Fleet Manager (Stage 1)

Single-repo project for a generic IoT fleet manager with: device registry, HTTP telemetry ingestion, Postgres storage (Prisma), live updates (WS), simple alert rules, and a minimal Next.js dashboard. This file orients an AI coding assistant (Gemini CLI) to the repo layout, conventions, and primary workflows.

Project Goals (Stage 1)

Simulated devices stream telemetry over HTTP (JSON).

API validates, stores to Postgres (via Prisma), updates lastSeenAt.

Rules engine triggers basic threshold alerts.

WebSockets push telemetry/alerts to the UI.

Next.js dashboard lists devices, shows latest metrics & active alerts.

Docker Compose brings up DB, backend, frontend, and a simulator.

Definition of Done: docker compose up → visit frontend → see simulated devices updating, alerts firing, data persisted; basic tests green.

High-Level Architecture
[Simulated Devices] --HTTP--> [Backend API (Express)]
                                  |  \
                                  |   \__ (WS broadcast) ----> [Frontend (Next.js)]
                                  \
                                   \__ Prisma ORM --> [Postgres 16]


Why this shape?

HTTP first: simplest to debug (curl/Postman). MQTT later.

WS push: near-real-time dashboard updates.

Postgres + Prisma: familiar, ergonomic. (TimescaleDB optional later.)

Monorepo: one place to navigate; Docker for identical envs.

Services & Directories
IOT_FLEET_MANAGER/
├─ docker-compose.yml
├─ README.md
├─ .gitignore
├─ .env.example
├─ docker-data/
│  └─ pg/                     # Postgres volume (local)
├─ services/
│  ├─ backend/                # Node/Express API + WebSocket + Prisma
│  │  ├─ Dockerfile
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  ├─ prisma/
│  │  │  └─ schema.prisma     # Device, Telemetry, Rule, Alert
│  │  └─ src/
│  │     ├─ index.ts          # Express app (routes, metrics, health)
│  │     ├─ server.ts         # HTTP server + WS server bootstrap
│  │     ├─ seed.ts           # seeds default rule(s)
│  │     ├─ routes/
│  │     │  ├─ ingest.ts      # POST /api/ingest
│  │     │  ├─ devices.ts     # GET/POST /api/devices; GET /api/devices/:id
│  │     │  └─ alerts.ts      # GET /api/alerts
│  │     └─ lib/
│  │        ├─ db.ts          # Prisma client singleton
│  │        ├─ rules.ts       # threshold evaluation
│  │        └─ ws.ts          # WebSocket broadcast helper
│  │
│  └─ frontend/               # Next.js (App Router)
│     ├─ Dockerfile
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ next.config.ts
│     └─ app/
│        ├─ layout.tsx
│        ├─ page.tsx          # Dashboard (links, summary)
│        ├─ devices/
│        │  ├─ page.tsx       # Device list (last-seen + latest metrics)
│        │  └─ [id]/
│        │     └─ page.tsx    # Device detail (recent telemetry)
│        └─ alerts/
│           └─ page.tsx       # Active alerts
│
├─ scripts/
│  └─ simulator/
│     ├─ Dockerfile
│     ├─ package.json
│     └─ index.js             # posts randomized telemetry to backend
│
└─ tests/                      # (optional) unit/integration tests
   ├─ backend/
   └─ frontend/

Data Model (Prisma)

Device: id, name, type, lastSeenAt, tags[], locationHint?

Telemetry: deviceId, timestamp, temperature_c?, humidity_pct?, battery_pct?, extras? (JSON)

Rule: metric, operator (" >",">=","<","<=" ), value, severity, enabled

Alert: deviceId, ruleId, createdAt, severity, message, context?

Key indexes: (deviceId, timestamp) on Telemetry; (deviceId, createdAt) on Alert.

API Contracts (Backend)
Telemetry Ingest

POST /api/ingest

{
  "deviceId": "dev-001",
  "timestamp": "2025-08-18T23:00:00Z",
  "metrics": {
    "temperature_c": 21.7,
    "humidity_pct": 48.3,
    "battery_pct": 93
  },
  "extras": { "door_open": false }
}


Behavior: Validate → upsert Device (update lastSeenAt) → insert Telemetry → evaluate Rules → broadcast events (type: "telemetry" and type: "alert").

Devices

GET /api/devices → list with latest telemetry snapshot

POST /api/devices → { id?, name, type, tags?, locationHint? }

GET /api/devices/:id → device + recent telemetry (paginated later)

Alerts

GET /api/alerts?active=true → latest active alerts

Health & Metrics

GET /health → { ok: true }

GET /metrics → Prometheus exposition

Live (WebSocket)

Path: ws://<backend-host>/live

Messages:

{ "type": "telemetry", "payload": { "deviceId": "dev-001", "rec": { /* Telemetry row */ } } }
{ "type": "alert",     "payload": { /* Alert row */ } }

Simulator

Runs as scripts/simulator service in Compose.

Env:

TARGET_URL=http://backend:4000/api/ingest

DEVICES="dev-1,dev-2,dev-3,dev-4,dev-5"

PERIOD_MS=3000

Emits Gaussian-ish values for temp/humidity; slow battery drain; occasional door_open.

Environment Variables
Root .env.example

(Reference file for developers; not used directly by Compose.)

Backend

DATABASE_URL=postgresql://iot:iot@db:5432/iot

PORT=4000

WS_ENABLED=true (present for clarity; WS starts by default)

Frontend

NEXT_PUBLIC_API_BASE=http://localhost:4000

NEXT_PUBLIC_WS_URL=ws://localhost:4000/live

Simulator

TARGET_URL, DEVICES, PERIOD_MS (see above)

Development Workflow
Bring up the stack
docker compose up --build

First-time DB migration & seed
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npm run seed

Useful local URLs

Frontend: http://localhost:3000

Devices API: http://localhost:4000/api/devices

Alerts API: http://localhost:4000/api/alerts?active=true

Health: http://localhost:4000/health

Metrics: http://localhost:4000/metrics

Coding Conventions

TypeScript strict in both services.

Validation at API boundaries via Zod (ingest payload).

Prisma singleton per service process (lib/db.ts).

Routing: Express routers per resource (routes/*).

Events: structured JSON over WS { type, payload }.

Logging: start simple (console), add pino later if needed.

Testing: split unit vs. integration under tests/.

Common Gemini Tasks (Examples)

Use these task phrases to direct the agent precisely:

“Add pagination to device telemetry”
Modify services/backend/src/routes/devices.ts (GET /api/devices/:id) to accept take and cursor query params. Update frontend devices/[id]/page.tsx to request pages.

“Add a new metric (co2_ppm)”

Update Prisma model Telemetry in schema.prisma.

Run migration.

Accept it in ingest.ts Zod schema & write to DB.

Surface on device list/detail pages.

“Add a new rule for low humidity (< 30%)”
Update seeder (src/seed.ts) or create via Prisma in a new script; ensure rules.ts evaluates the metric and WS broadcasts alerts.

“Show a 24h sparkline on Device Detail”
Fetch recent telemetry in devices/[id]/page.tsx; render a lightweight client-side chart (e.g., SVG path or minimal chart lib).

“Add SSE fallback for WS” (stretch)
Introduce /events endpoint; push text/event-stream; add EventSource client code gated by feature detection.

Testing Strategy (Stage 1)

Unit (backend):

Zod validators for ingest payloads.

Rule comparator logic (rules.ts).

Integration (backend):

POST /api/ingest → row in Telemetry, Device.lastSeenAt updated, Alert created when threshold exceeded.

Frontend smoke:

Devices page lists rows and shows latest.temperature_c.

Alerts page renders active alerts.

Troubleshooting

Backend cannot connect to DB: check DATABASE_URL in backend env; ensure db service is healthy.

Prisma migrate errors: remove local docker-data/pg only if safe; re-up and re-migrate.

No live updates: confirm WS path /live is accessible and frontend NEXT_PUBLIC_WS_URL points to backend.

Simulator not posting: verify TARGET_URL (should be http://backend:4000/api/ingest within Compose network).

Roadmap (Later Stages)

MQTT ingestion (Mosquitto/EMQX), QoS & backpressure

Multi-tenant orgs & auth (JWT/NextAuth)

TimescaleDB hypertables; retention policies

Rich rule engine (compound conditions, durations)

Device locations (maps), GPS, geofencing

Alert channels (email/webhook/Slack)

Edge gateways & OTA flows

Glossary

Device: a logical producer of telemetry (real or simulated).

Telemetry: time-stamped numeric readings and optional metadata.

Rule: a simple threshold on a metric with a comparison operator.

Alert: a record created when a rule condition is met.

WS: WebSockets for pushing events to the frontend.

Editing Notes for Agents

Keep changes scoped to the files listed above; prefer small PRs.

Update this GEMINI.md when you add endpoints, models, or services.

When modifying Prisma models, always include the migration steps and any seed updates in your output.