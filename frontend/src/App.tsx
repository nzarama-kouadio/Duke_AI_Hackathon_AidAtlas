import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";
import { API_BASE_URL } from "./config";
import { DonationForm } from "./components/DonationForm";
import { DonationGlobe } from "./components/DonationGlobe";
import { ThankYouCard } from "./components/ThankYouCard";
import type { Donation } from "./types";
import { donationToArc, donationsToArcs } from "./lib/donationTransforms";
import { getCountryName } from "./lib/countryData";

function App() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [latestDonation, setLatestDonation] = useState<Donation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [statusIntent, setStatusIntent] = useState<"info" | "success" | "error">(
    "info"
  );

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    const fetchDonations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/donations`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Failed to load donations (${response.status})`);
        }
        const payload = (await response.json()) as Donation[];
        if (isActive) {
          setDonations(payload);
        }
      } catch (error) {
        console.error(error);
        if (isActive) {
          setStatusMessage(
            "We couldn't load the live donation feed. Please try again shortly."
          );
          setStatusIntent("error");
        }
      }
    };

    fetchDonations();

    const socket: Socket = io(API_BASE_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => setSocketConnected(true));
    socket.on("disconnect", () => setSocketConnected(false));

    socket.on("donation:init", (initial: Donation[]) => {
      if (!Array.isArray(initial)) return;
      setDonations(initial);
    });

    socket.on("donation:new", (donation: Donation) => {
      if (!donation || typeof donation.id !== "string") return;
      setDonations((prev) => {
        const exists = prev.some((item) => item.id === donation.id);
        return exists ? prev : [...prev, donation];
      });
    });

    return () => {
      isActive = false;
      controller.abort();
      socket.disconnect();
    };
  }, []);

  const arcs = useMemo(() => donationsToArcs(donations), [donations]);

  const recentFeed = useMemo(() => {
    const latestFive = [...donations].slice(-6).reverse();
    return latestFive.map((donation) => {
      const donor = getCountryName(donation.donorCountry) ?? donation.donorCountry;
      const recipient =
        getCountryName(donation.recipientCountry) ?? donation.recipientCountry;
      return `${donor} → ${recipient}`;
    });
  }, [donations]);

  const latestArc = useMemo(
    () => (latestDonation ? donationToArc(latestDonation) : null),
    [latestDonation]
  );

  const handleDonationSubmit: ComponentProps<
    typeof DonationForm
  >["onSubmit"] = async ({ donorCountry, recipientCountry, amount, message }) => {
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/donations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          donorCountry,
          recipientCountry,
          amount,
          message: message || null,
        }),
      });

      if (!response.ok) {
        throw new Error(`Donation failed (${response.status})`);
      }

      const savedDonation = (await response.json()) as Donation;
      setLatestDonation(savedDonation);
      setStatusIntent("success");
      setStatusMessage("Thank you! Your donation is now live on the globe.");
    } catch (error) {
      console.error(error);
      setStatusIntent("error");
      setStatusMessage(
        "We couldn't process your donation. Please check the details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-content">
          <h1>Aid Atlas</h1>
          <p>
            Watch generosity orbit the planet. Every donation lights up a path
            from givers to communities in need.
          </p>
        </div>
        <div className={`status-dot ${socketConnected ? "online" : "offline"}`}>
          {socketConnected ? "Live feed" : "Offline"}
        </div>
      </header>

      {statusMessage && (
        <div className={`status-banner ${statusIntent}`}>{statusMessage}</div>
      )}

      <main className="layout-grid">
        <section className="live-impact">
          <header className="section-header">
            <div>
              <h2>Global Impact Feed</h2>
              <p>See every connection created through Aid Atlas in real time.</p>
            </div>
            <span className="arc-count">{arcs.length} active routes</span>
          </header>

          <DonationGlobe
            arcs={arcs}
            highlightArcId={latestDonation?.id ?? null}
            height={480}
            className="live-globe"
          />

          <div className="feed-list">
            {recentFeed.length === 0 ? (
              <p>No donations yet — your generosity could be the first spark.</p>
            ) : (
              recentFeed.map((label, index) => (
                <div className="feed-item" key={index}>
                  <span>{label}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <aside className="action-panel">
          <DonationForm onSubmit={handleDonationSubmit} isSubmitting={isSubmitting} />

          {latestDonation && (
            <ThankYouCard donation={latestDonation} arc={latestArc} />
          )}
        </aside>
      </main>

      <footer className="footer">
        <p>
          Built for the Duke AI Hackathon — inspired by the GitHub globe to showcase
          compassion in motion.
        </p>
      </footer>
    </div>
  );
}

export default App;
