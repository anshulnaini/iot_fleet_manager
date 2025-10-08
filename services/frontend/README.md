# IoT Fleet Manager - Frontend Service

This directory contains the frontend service for the IoT Fleet Manager. It is a [Next.js](https://nextjs.org/) application written in TypeScript, using the App Router. The UI is built with [Chakra UI](https://chakra-ui.com/), and state management is handled by [Zustand](https://github.com/pmndrs/zustand).

## File Structure

```
services/frontend/
├── Dockerfile
├── next.config.mjs
├── package.json
├── tsconfig.json
└── app/
    ├── layout.tsx
    ├── page.tsx
    ├── providers.tsx
    ├── live-provider.tsx
    ├── live-store.ts
    ├── alerts/
    │   └── page.tsx
    └── devices/
        ├── page.tsx
        ├── device-form.tsx
        └── [id]/
            └── (empty)
```

## Getting Started

The frontend service is designed to be run with Docker Compose from the root of the project.

1.  **Navigate to the project root.**
2.  Ensure the backend service is running.
3.  Run the stack: `docker compose up --build`

The frontend service will be available at `http://localhost:3000`.

## Key Scripts

These scripts can be run from within the `frontend` service container (`docker compose exec frontend <command>`).

-   `npm run dev`: Starts the Next.js development server.
-   `npm run build`: Creates an optimized production build of the application.
-   `npm run start`: Starts the application in production mode.
-   `npm run lint`: Runs the ESLint code linter.

## Core Components & Logic

-   **`app/layout.tsx`**: The root layout of the application. It wraps all pages in the `Providers` and `LiveProvider`.
-   **`app/providers.tsx`**: Sets up the Chakra UI theme and context.
-   **`app/live-provider.tsx`**: A key component that handles the application's real-time aspects. It fetches the initial data (devices, alerts) and establishes a WebSocket connection to the backend to receive live updates.
-   **`app/live-store.ts`**: A Zustand store that serves as the central client-side state manager for live data like devices and alerts. It includes actions for fetching data and handling real-time updates.
-   **`app/devices/page.tsx`**: The main page for listing, creating, editing, and deleting devices.
-   **`app/alerts/page.tsx`**: The page for listing active alerts.

## Core Libraries

-   **Next.js**: The React framework for building the application.
-   **React**: The core UI library.
-   **Chakra UI**: A component library for building the user interface.
-   **Zustand**: A small, fast, and scalable state-management solution.
-   **React Hook Form**: A library for managing forms with ease.

## Environment Variables

The frontend service requires the following environment variables to be set, typically in a `.env.local` file or passed by Docker Compose:

-   `NEXT_PUBLIC_API_BASE`: The base URL for the backend API. Example: `http://localhost:4000`
-   `NEXT_PUBLIC_WS_URL`: The URL for the backend WebSocket server. Example: `ws://localhost:4000/live`

## Containerization

The service is containerized using the provided `Dockerfile`. It uses a standard Node.js build process:

1.  Starts from a `node:20-alpine` base image.
2.  Installs dependencies using `npm install`.
3.  Copies the source code.
4.  Builds the Next.js application using `npm run build`.
5.  The final command `npm start` runs the production server.
