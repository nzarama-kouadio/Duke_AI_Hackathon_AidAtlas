import type { Donation, GlobeArcDatum } from "../types";
import { DonationGlobe } from "./DonationGlobe";
import { getCountryName } from "../lib/countryData";

interface ThankYouCardProps {
  donation: Donation;
  arc: GlobeArcDatum | null;
}

export function ThankYouCard({ donation, arc }: ThankYouCardProps) {
  const donorName =
    getCountryName(donation.donorCountry) ?? donation.donorCountry;
  const recipientName =
    getCountryName(donation.recipientCountry) ?? donation.recipientCountry;

  return (
    <section className="thank-you-card">
      <div className="thank-you-text">
        <h3>Thank you for your generosity!</h3>
        <p>
          Your support is flying from <strong>{donorName}</strong> to{" "}
          <strong>{recipientName}</strong>.
        </p>
        {donation.message && (
          <blockquote>“{donation.message}”</blockquote>
        )}
      </div>
      {arc ? (
        <DonationGlobe
          arcs={[arc]}
          highlightArcId={arc.id}
          height={320}
          labelVisible={false}
          autoRotateSpeed={0.6}
          className="thank-you-globe"
        />
      ) : (
        <div className="thank-you-globe placeholder">
          <p>We&apos;re mapping your route...</p>
        </div>
      )}
    </section>
  );
}
