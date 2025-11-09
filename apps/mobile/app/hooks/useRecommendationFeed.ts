import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export type ConflictCard = {
  id: string;
  country: string;
  title: string;
  summary: string;
  severityLevel: "low" | "medium" | "high" | "critical";
  organizations: {
    id: string;
    name: string;
    verificationStatus: "verified" | "pending" | "unverified";
  }[];
};

async function fetchRecommendations(): Promise<ConflictCard[]> {
  // TODO: integrate with real API once backend endpoints are ready
  return Promise.resolve([
    {
      id: "31d8285b-e0b8-40bf-98bc-74df919ff001",
      country: "Ukraine",
      title: "Eastern Ukraine Humanitarian Crisis",
      summary:
        "Ongoing conflict continues to displace families. Donations support emergency shelter and medical kits.",
      severityLevel: "critical",
      organizations: [
        {
          id: "2b663a5c-2f93-4338-9b15-2bfb911ab101",
          name: "Global Relief Network",
          verificationStatus: "verified",
        },
      ],
    },
  ]);
}

export const useRecommendationFeed = () => {
  const query = useQuery({
    queryKey: ["recommendations"],
    queryFn: fetchRecommendations,
  });

  return useMemo(
    () => ({
      ...query,
      cards: query.data ?? [],
    }),
    [query],
  );
};
