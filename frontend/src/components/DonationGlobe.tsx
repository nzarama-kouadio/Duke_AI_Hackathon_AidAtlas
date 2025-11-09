import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";
import type { GlobeArcDatum } from "../types";

export interface DonationGlobeProps {
  arcs: GlobeArcDatum[];
  highlightArcId?: string | null;
  height?: number;
  autoRotateSpeed?: number;
  labelVisible?: boolean;
  className?: string;
}

type GlobeReadyState = "idle" | "ready";

const EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg";
const EARTH_BUMP =
  "https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png";
const BACKGROUND =
  "https://unpkg.com/three-globe@2.31.1/example/img/night-sky.png";

type StyledArcDatum = GlobeArcDatum & {
  color: [string, string];
  dashLength: number;
  dashGap: number;
  dashAnimateTime: number;
  altitude: number;
};

export function DonationGlobe({
  arcs,
  highlightArcId = null,
  height = 420,
  autoRotateSpeed = 0.45,
  labelVisible = true,
  className,
}: DonationGlobeProps) {
  const [mountState, setMountState] = useState<GlobeReadyState>("idle");
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    setMountState("ready");
  }, []);

  useEffect(() => {
    if (mountState !== "ready" || !globeRef.current) return;
    const controls = globeRef.current.controls?.();
    if (!controls) return;
    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.enableZoom = false;
    controls.enablePan = false;
  }, [mountState, autoRotateSpeed]);

  const arcsData: StyledArcDatum[] = useMemo(
    () =>
      arcs.map((arc, index) => {
        const isHighlighted = highlightArcId
          ? arc.id === highlightArcId
          : false;
        return {
          ...arc,
          color: isHighlighted
            ? ["#FF9A62", "#FFD36B"]
            : ["rgba(20, 255, 236, 0.6)", "rgba(113, 126, 255, 0.8)"],
          dashLength: isHighlighted ? 0.95 : 0.45,
          dashGap: isHighlighted ? 0.01 : 0.4,
          dashAnimateTime: isHighlighted ? 1200 : 1800,
          altitude: 0.18 + ((index % 6) * 0.015),
        };
      }),
    [arcs, highlightArcId]
  );

  const labelData = useMemo(() => {
    if (!labelVisible) return [];
    const last = arcs[arcs.length - 1];
    return last
      ? [
          {
            lat: last.endLat,
            lng: last.endLng,
            label: `${last.donorName} → ${last.recipientName}`,
          },
        ]
      : [];
  }, [arcs, labelVisible]);

  const combinedClass = ["globe-wrapper", className]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <div className={combinedClass} style={{ height }}>
      {mountState === "ready" ? (
        <Globe
          ref={globeRef}
          height={height}
          backgroundImageUrl={BACKGROUND}
          globeImageUrl={EARTH_TEXTURE}
          bumpImageUrl={EARTH_BUMP}
          arcsData={arcsData}
          arcColor={(d: object) => (d as StyledArcDatum).color}
          arcDashLength={(d: object) => (d as StyledArcDatum).dashLength}
          arcDashGap={(d: object) => (d as StyledArcDatum).dashGap}
          arcDashAnimateTime={(d: object) =>
            (d as StyledArcDatum).dashAnimateTime
          }
          arcsTransitionDuration={0}
          arcAltitude={(d: object) => (d as StyledArcDatum).altitude}
          labelsData={labelData}
          labelLat={(d: object) => (d as { lat: number }).lat}
          labelLng={(d: object) => (d as { lng: number }).lng}
          labelText={(d: object) => (d as { label: string }).label}
          labelColor={() => "#ffffff"}
          labelSize={1.15}
          labelAltitude={0.01}
        />
      ) : (
        <div className="globe-placeholder" />
      )}
    </div>
  );
}
