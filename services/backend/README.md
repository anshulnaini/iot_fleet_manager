# IoT Fleet Manager - Backend Service

This directory contains the backend service for the IoT Fleet Manager. It is a Node.js application written in TypeScript that uses Express for handling API requests, Prisma as an ORM for the PostgreSQL database, and a WebSocket server for real-time communication.

## File Structure

```
services/backend/
├── Dockerfile
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── src/
    ├── index.ts
    ├── server.ts
    ├── seed.ts
    ├── lib/
    │   ├── db.ts
    │   ├── rules.ts
    │   ├── validation.ts
    │   └── ws.ts
    └── routes/
        ├── alerts.ts
        ├── devices.ts
        ├── ingest.ts
        ├── rules.ts
        └── telemetry.ts
```

## Getting Started

The backend service is designed to be run with Docker Compose from the root of the project.

1.  **Navigate to the project root.**
2.  Ensure you have a `.env` file configured with the necessary environment variables (see `.env.example` in the root).
3.  Run the stack: `docker compose up --build`

The backend service will be available at `http://localhost:4000`.

## Key Scripts

These scripts can be run from within the `backend` service container (`docker compose exec backend <command>`).

-   `npm run build`: Compiles the TypeScript code to JavaScript.
-   `npm run start`: Starts the compiled application (for production).
-   `npm run dev`: Starts the application in development mode with hot-reloading using `tsx`.
-   `npm run seed`: Seeds the database with initial data (e.g., default rules).

## Data Model

The data model is defined in `prisma/schema.prisma`. It consists of four main models:

-   `Device`: Represents a registered IoT device.
-   `Telemetry`: Stores time-series data received from devices.
-   `Rule`: Defines conditions for creating alerts based on telemetry data.
-   `Alert`: A record created when a rule's condition is met.

Relations are defined to link these models, with cascading deletes in place for `Telemetry` and `Alerts` when a `Device` is deleted.

## API Endpoints

The API is versioned under the `/api` prefix.

### Health
-   `GET /health`: Returns `{ ok: true }` to indicate the service is running.

### Ingest
-   `POST /api/ingest`: The primary endpoint for devices to post their telemetry data.

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

## Core Libraries

-   **Express**: Web framework for creating the API.
-   **Prisma**: Next-generation ORM for database access.
-   **Zod**: TypeScript-first schema validation.
-   **ws**: WebSocket library for real-time communication.
-   **tsx**: Node.js runtime for executing TypeScript and ESM.

## Environment Variables

The primary environment variable required by this service is:

-   `DATABASE_URL`: The connection string for the PostgreSQL database. Example: `postgresql://user:password@host:port/database`

This is typically loaded from the root `.env` file by Docker Compose.

## Containerization

The service is containerized using the provided `Dockerfile`. It uses a multi-stage build process:

1.  Starts from a `node:20-alpine` base image.
2.  Installs dependencies using `npm install`.
3.  Copies the source code.
4.  Builds the TypeScript code using `npm run build`.
5.  The final command `npm start` runs the compiled application.
