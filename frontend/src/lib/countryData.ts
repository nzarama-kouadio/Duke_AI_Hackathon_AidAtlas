import { geoCentroid } from "d3-geo";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature } from "topojson-client";
import worldTopology from "world-atlas/countries-110m.json";

countries.registerLocale(enLocale);

type CountryCoord = { lat: number; lng: number };
type CountryOption = { code: string; name: string };

const coordsByAlpha2: Map<string, CountryCoord> = new Map();
const rawCountryNames = countries.getNames("en", {
  select: "alias",
}) as Record<string, string | string[]>;

const countryNames: Record<string, string> = Object.entries(rawCountryNames).reduce(
  (acc, [code, name]) => {
    const normalized = Array.isArray(name) ? name[0] : name;
    if (typeof normalized === "string" && normalized.trim().length > 0) {
      acc[code] = normalized;
    }
    return acc;
  },
  {} as Record<string, string>
);

const worldGeo = feature(
  worldTopology as any,
  (worldTopology as any).objects.countries
) as unknown as FeatureCollection<Geometry, { name?: string }>;

worldGeo.features.forEach((geoFeature: Feature<Geometry, { name?: string }>) => {
  const id = geoFeature.id;
  if (id === undefined || id === null) {
    return;
  }

  const alpha2 = countries.numericToAlpha2(id as number | string);

  if (!alpha2) {
    return;
  }

  const [lng, lat] = geoCentroid(geoFeature);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    coordsByAlpha2.set(alpha2, { lat, lng });
  }
});

const options: CountryOption[] = Object.entries(countryNames)
  .filter(([code]) => coordsByAlpha2.has(code))
  .map(([code, name]) => ({
    code,
    name,
  }))
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

export const getCountryOptions = (): CountryOption[] => options;

export const getCountryCoordinates = (code: string): CountryCoord | null => {
  if (!code) return null;
  const coords = coordsByAlpha2.get(code.toUpperCase());
  return coords ?? null;
};

export const getCountryName = (code: string): string | null => {
  if (!code) return null;
  return countryNames[code.toUpperCase()] ?? null;
};
