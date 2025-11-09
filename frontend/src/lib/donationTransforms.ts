import type { Donation, GlobeArcDatum } from "../types";
import {
  getCountryCoordinates,
  getCountryName,
} from "./countryData";

export const donationToArc = (
  donation: Donation
): GlobeArcDatum | null => {
  const start = getCountryCoordinates(donation.donorCountry);
  const end = getCountryCoordinates(donation.recipientCountry);
  if (!start || !end) {
    return null;
  }

  return {
    id: donation.id,
    donorName:
      getCountryName(donation.donorCountry) ?? donation.donorCountry,
    recipientName:
      getCountryName(donation.recipientCountry) ?? donation.recipientCountry,
    startLat: start.lat,
    startLng: start.lng,
    endLat: end.lat,
    endLng: end.lng,
    createdAt: donation.createdAt,
  };
};

export const donationsToArcs = (
  donations: Donation[]
): GlobeArcDatum[] =>
  donations
    .map(donationToArc)
    .filter((arc): arc is GlobeArcDatum => Boolean(arc));
