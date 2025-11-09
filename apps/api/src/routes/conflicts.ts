import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const conflictSchema = z.object({
  id: z.string().uuid(),
  country: z.string(),
  region: z.string(),
  title: z.string(),
  summary: z.string(),
  severityLevel: z.enum(["low", "medium", "high", "critical"]),
  affectedGroups: z.array(z.string()),
  lastUpdated: z.string(),
  organizations: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      verificationStatus: z.enum(["verified", "pending", "unverified"]),
      donationUrl: z.string().url(),
    })
  ),
});

type Conflict = z.infer<typeof conflictSchema>;

const mockConflicts: Conflict[] = [
  {
    id: "31d8285b-e0b8-40bf-98bc-74df919ff001",
    country: "Ukraine",
    region: "Europe",
    title: "Eastern Ukraine Humanitarian Crisis",
    summary:
      "AidAtlas curated overview of urgent humanitarian needs across eastern Ukraine, focusing on displaced families and critical infrastructure damage.",
    severityLevel: "critical",
    affectedGroups: ["displaced_families", "children", "elderly"],
    lastUpdated: new Date().toISOString(),
    organizations: [
      {
        id: "2b663a5c-2f93-4338-9b15-2bfb911ab101",
        name: "Global Relief Network",
        verificationStatus: "verified",
        donationUrl: "https://donate.example.org/ukraine",
      },
    ],
  },
];

const conflictsRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/",
    {
      schema: {
        response: {
          200: z.object({ conflicts: z.array(conflictSchema) }),
        },
      },
    },
    async () => ({ conflicts: mockConflicts })
  );

  app.get(
    "/:conflictId",
    {
      schema: {
        params: z.object({ conflictId: z.string().uuid() }),
        response: {
          200: conflictSchema,
        },
      },
    },
    async (request, reply) => {
      const conflict = mockConflicts.find((item) => item.id === request.params.conflictId);

      if (!conflict) {
        return reply.notFound("Conflict not found");
      }

      return conflict;
    }
  );
};

export default conflictsRoutes;
