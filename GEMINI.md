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

Frontend uses Chakra UI for components, Zustand for state, and React Hook Form for forms.

Services & Directories
IOT_FLEET_MANAGER/
├─ docker-compose.yml
├─ README.md
├─ .gitignore
├─ .env.example
├─ docker-data/      # optional backups ((volumes are now managed by Docker: `pgdata` instead of ./docker-data/pg))
│
├─ services/
│  ├─ backend/                # Node/Express API + WebSocket + Prisma
│  │  ├─ Dockerfile
│  │  ├─ README.md           # Backend-specific documentation
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
│  │     │  ├─ devices.ts     # CRUD for devices
│  │     │  ├─ alerts.ts      # CRUD for alerts
│  │     │  ├─ rules.ts       # CRUD for rules
│  │     │  └─ telemetry.ts   # CRUD for telemetry
│  │     └─ lib/
│  │        ├─ db.ts          # Prisma client singleton
│  │        ├─ rules.ts       # threshold evaluation
│  │        ├─ ws.ts          # WebSocket broadcast helper
|  |        └─ validation.ts  # Validation logic for incoming telemetry
│  │
│  └─ frontend/               # Next.js (App Router)
|     ├─ README.md
│     ├─ Dockerfile
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ next.config.mjs
│     └─ app/
│        ├─ layout.tsx
│        ├─ page.tsx          # Dashboard (links, summary)
│        ├─ providers.tsx     # Chakra UI and other context providers
│        ├─ live-provider.tsx # WebSocket connection and data fetching
│        ├─ live-store.ts     # Zustand store for live data
│        ├─ devices/
│        │  ├─ page.tsx       # Device list (last-seen + latest metrics)
│        │  ├─ device-form.tsx # Form for creating/editing devices
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

Rule: metric, operator (" >","=-","<","<=" ), value, severity, enabled

Alert: deviceId, ruleId, createdAt, severity, message, context?

Key indexes: (deviceId, timestamp) on Telemetry; (deviceId, createdAt) on Alert.

API Contracts (Backend)

### Telemetry Ingest
-   `POST /api/ingest`: Endpoint for devices to post their telemetry data.

### Devices
-   `GET /api/devices`: Get a list of all devices.
-   `POST /api/devices`: Create a new device.
-   `GET /api/devices/:id`: Get a specific device by ID.
-   `PUT /api/devices/:id`: Update a specific device.
-   `DELETE /api/devices/:id`: Delete a specific device.

### Rules
-   `GET /api/rules`: Get a list of all rules.
-   `POST /api/rules`: Create a new rule.
-   `GET /api/rules/:id`: Get a specific rule by ID.
-   `PUT /api/rules/:id`: Update a specific rule.
-   `DELETE /api/rules/:id`: Delete a specific rule.

### Alerts
-   `GET /api/alerts`: Get a list of all alerts.
-   `GET /api/alerts?rule_enabled=true`: Get a list of alerts from currently enabled rules.
-   `GET /api/alerts/:id`: Get a specific alert by ID.
-   `DELETE /api/alerts/:id`: Delete a specific alert.

### Telemetry
-   `GET /api/telemetry`: Get a list of the latest telemetry records.
-   `GET /api/telemetry/:id`: Get a specific telemetry record by ID.
-   `DELETE /api/telemetry/:id`: Delete a specific telemetry record.

### Health & Metrics
-   `GET /health`: Returns `{ ok: true }`.
-   `GET /metrics`: Prometheus exposition.

Live (WebSocket)

Path: ws://<backend-host>/live

Messages:

{ "type": "telemetry", "payload": { "deviceId": "dev-001", "rec": { /* Telemetry row */ } } }
{ "type": "alert",     "payload": { /* Alert row */ } }


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
Use the `POST /api/rules` endpoint or update the seeder (`src/seed.ts`).

“Show a 24h sparkline on Device Detail”
Fetch recent telemetry in devices/[id]/page.tsx; render a lightweight client-side chart (e.g., SVG path or minimal chart lib).


Editing Notes for Agents

Keep changes scoped to the files listed above; prefer small PRs.

Update this GEMINI.md when you add endpoints, models, or services.

When modifying Prisma models, always include the migration steps and any seed updates in your output.
