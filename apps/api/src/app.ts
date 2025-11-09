import Fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import conflictRoutes from "./routes/conflicts.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import { logger } from "./logger.js";

export const buildServer = async () => {
  const app = Fastify({
    logger: logger.child({ service: "api" }),
    ajv: {
      customOptions: {
        removeAdditional: true,
        useDefaults: true,
        coerceTypes: true,
      },
    },
  }).withTypeProvider<ZodTypeProvider>();

  await app.register(sensible);
  await app.register(cors, { origin: true, credentials: true });
  await app.register(helmet, { global: true });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  await app.register(healthRoutes, { prefix: "/health" });
  await app.register(userRoutes, { prefix: "/v1/users" });
  await app.register(conflictRoutes, { prefix: "/v1/conflicts" });

  return app;
};
