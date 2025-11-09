import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const userPreferenceSchema = z.object({
  causes: z.array(z.string()).default([]),
  regions: z.array(z.string()).default([]),
  preferredDonationRange: z.string().nullable().default(null),
});

const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  location: z
    .object({
      lat: z.number().nullable(),
      lng: z.number().nullable(),
      country: z.string().nullable(),
    })
    .nullable(),
  createdAt: z.string(),
  preferences: userPreferenceSchema,
});

type UserProfile = z.infer<typeof userProfileSchema>;

const mockUser: UserProfile = {
  id: "604e76da-0be0-4f41-9e6d-3fb1f2c1d001",
  email: "demo@aidatlas.org",
  name: "Demo Donor",
  location: {
    lat: 35.7796,
    lng: -78.6382,
    country: "US",
  },
  createdAt: new Date().toISOString(),
  preferences: {
    causes: ["humanitarian_aid"],
    regions: ["europe"],
    preferredDonationRange: "$25-$50",
  },
};

const usersRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get(
    "/me",
    {
      schema: {
        response: {
          200: userProfileSchema,
        },
      },
    },
    async () => mockUser
  );

  app.put(
    "/me/preferences",
    {
      schema: {
        body: userPreferenceSchema.partial(),
        response: {
          200: userPreferenceSchema,
        },
      },
    },
    async (request) => {
      const { body } = request;
      const updated = {
        ...mockUser.preferences,
        ...body,
      };

      return updated;
    }
  );
};

export default usersRoutes;
