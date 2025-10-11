# RBAC and JWT Implementation Plan

This document outlines the plan for implementing Role-Based Access Control (RBAC) and JSON Web Tokens (JWT) for the IoT Fleet Manager.

## Part 1: Backend (Express.js)

1.  **Update Prisma Schema (`prisma/schema.prisma`):**
    *   Create a `User` model with fields like `id`, `email`, `password`, `role`, `createdAt`, `updatedAt`.
    *   Create a `Role` enum (e.g., `ADMIN`, `USER`).
    *   Add a relation between `User` and `Device` (a user can have many devices).

2.  **Database Migration:**
    *   Run `npx prisma migrate dev --name add-user-and-role-models` to apply the schema changes.

3.  **Seed the Database (`src/seed.ts`):**
    *   Create a default `ADMIN` user for initial testing.

4.  **Implement Authentication Routes (`src/routes/auth.ts`):**
    *   Create a new `auth.ts` file in the `routes` directory.
    *   **`POST /api/auth/register`:**
        *   Hash the user's password (using `bcrypt`).
        *   Create a new user in the database.
    *   **`POST /api/auth/login`:**
        *   Find the user by email.
        *   Compare the provided password with the stored hash.
        *   If valid, generate a JWT (using `jsonwebtoken`) containing the `userId` and `role`.
        *   Return the JWT to the client.

5.  **Create JWT and RBAC Middleware (`src/lib/auth.ts`):**
    *   Create a new `auth.ts` file in the `lib` directory.
    *   **`verifyToken` middleware:**
        *   Extracts the JWT from the `Authorization` header.
        *   Verifies the token's signature.
        *   Attaches the decoded user information (`userId`, `role`) to the `Request` object.
    *   **`checkRole` middleware:**
        *   A higher-order function that takes a role (e.g., `ADMIN`) as an argument.
        *   Checks if the user's role from the request object matches the required role.
        *   Returns a 403 Forbidden error if the role does not have permission.

6.  **Secure Existing Routes:**
    *   **`src/routes/devices.ts`:**
        *   Apply the `verifyToken` middleware to all device routes.
        *   For routes that modify data (e.g., `POST`, `PUT`, `DELETE`), you could restrict them to `ADMIN`s or device owners.
        *   Update the `GET /api/devices` endpoint to only return devices owned by the logged-in user (unless they are an `ADMIN`).
    *   **`src/routes/rules.ts` & `src/routes/alerts.ts`:**
        *   Apply `verifyToken` and `checkRole` middleware as needed (e.g., only `ADMIN`s can create new rules).

## Part 2: Frontend (Next.js)

1.  **Create Login and Registration Pages:**
    *   Create new pages for `/login` and `/register`.
    *   Build forms using Chakra UI and React Hook Form.
    *   Use the `api.ts` pattern to make requests to the new backend `auth` endpoints.

2.  **JWT Handling:**
    *   Upon successful login, store the JWT. The most secure way is to have the backend set an `HttpOnly` cookie.
    *   Create a "session" context or use the existing Zustand store to manage the user's authentication state.

3.  **Authenticated API Requests:**
    *   Update the API fetching logic to include the JWT in the `Authorization` header for all protected requests.

4.  **UI Adaptation:**
    *   Use the authentication state to conditionally render UI elements. For example:
        *   Show "Login" or "Logout" buttons.
        *   Hide the "Create Rule" button if the user is not an `ADMIN`.
        *   Redirect unauthenticated users from protected pages to the login page.
