import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/",
    {
      schema: {
        response: {
          200: z.object({
            status: z.literal("ok"),
            uptime: z.number(),
            timestamp: z.string(),
          }),
        },
      },
    },
    async () => ({
      status: "ok" as const,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    })
  );
};

export default healthRoutes;
