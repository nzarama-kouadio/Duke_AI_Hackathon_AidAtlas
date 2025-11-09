# AidAtlas API Service

A Fastify-based TypeScript service that exposes REST endpoints for the AidAtlas mobile application. The service is responsible for user onboarding, content delivery, and donation workflows (future).

## Scripts

- `npm run dev` – start the development server with live reloading (via `tsx`).
- `npm run build` – generate production build into `dist/`.
- `npm run start` – run the compiled server.
- `npm run lint` – run ESLint on the `src/` directory.
- `npm run test` – execute unit tests with Vitest.

## Project Structure

```
apps/api
  ├── src
  │   ├── app.ts             # Fastify app factory
  │   ├── server.ts          # Bootstraps HTTP server
  │   ├── config/env.ts      # Environment variable schema
  │   ├── logger.ts          # Shared logger configuration
  │   └── routes             # Route plugins (health, users, conflicts)
  ├── package.json
  ├── tsconfig.json
  └── tsconfig.build.json
```

## Environment Variables

| Name       | Description                    | Default |
| ---------- | ------------------------------ | ------- |
| `PORT`     | HTTP port                       | `4000`  |
| `LOG_LEVEL`| Pino log level (`info`, etc.)   | `info`  |
| `NODE_ENV` | Node environment                | `development` |

## Next Steps

- Integrate Firebase Auth JWT verification middleware.
- Connect to PostgreSQL via Prisma or Drizzle ORM for persistent data.
- Implement Stripe webhook handlers and donation endpoints.
- Add OpenAPI documentation generation.
