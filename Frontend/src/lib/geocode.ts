/**
 * Geocode địa chỉ → lat/lng
 * - Ưu tiên Google (VITE_GOOGLE_MAPS_API_KEY)
 * - Fallback Nominatim
 * Tối ưu: cache bộ nhớ, gộp request trùng (in-flight), giới hạn tốc độ Nominatim
 */

export type GeocodeResult = {
  lat: number;
  lng: number;
  displayName: string;
  provider: "google" | "nominatim";
  fromCache?: boolean;
};

export function getGoogleMapsApiKey(): string | undefined {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return typeof key === "string" && key.trim() ? key.trim() : undefined;
}

export function hasGoogleMapsKey(): boolean {
  return !!getGoogleMapsApiKey();
}

function normalizeQuery(address: string, city?: string): string {
  return [address, city, "Việt Nam"]
    .filter(Boolean)
    .join(", ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/* ---------- Cache + in-flight dedupe ---------- */
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24h trong session
type CacheEntry = { result: GeocodeResult | null; at: number };
const memoryCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<GeocodeResult | null>>();

/** Nominatim: tối đa ~1 req/giây */
let nominatimChain: Promise<void> = Promise.resolve();
let lastNominatimAt = 0;

function enqueueNominatim<T>(fn: () => Promise<T>): Promise<T> {
  const run = nominatimChain.then(async () => {
    const wait = Math.max(0, 1100 - (Date.now() - lastNominatimAt));
    if (wait) await new Promise((r) => setTimeout(r, wait));
    lastNominatimAt = Date.now();
    return fn();
  });
  nominatimChain = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export function clearGeocodeCache() {
  memoryCache.clear();
}

async function geocodeGoogle(q: string): Promise<GeocodeResult | null> {
  const key = getGoogleMapsApiKey();
  if (!key) return null;

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?" +
    new URLSearchParams({
      address: q,
      key,
      language: "vi",
      region: "vn",
    }).toString();

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google Geocoding HTTP ${res.status}`);

  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    results?: Array<{
      formatted_address: string;
      geometry: { location: { lat: number; lng: number } };
    }>;
  };

  if (data.status === "REQUEST_DENIED" || data.status === "INVALID_REQUEST") {
    throw new Error(data.error_message || `Google: ${data.status}`);
  }
  if (data.status === "OVER_QUERY_LIMIT") {
    throw new Error("Google Geocoding vượt hạn mức (quota). Thử lại sau.");
  }
  if (data.status === "ZERO_RESULTS" || !data.results?.length) return null;
  if (data.status !== "OK") {
    throw new Error(data.error_message || `Google: ${data.status}`);
  }

  const r = data.results[0];
  return {
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    displayName: r.formatted_address,
    provider: "google",
  };
}

async function geocodeNominatim(q: string): Promise<GeocodeResult | null> {
  return enqueueNominatim(async () => {
    const url =
      "https://nominatim.openstreetmap.org/search?" +
      new URLSearchParams({
        format: "json",
        q,
        limit: "1",
        addressdetails: "0",
      }).toString();

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`Nominatim lỗi HTTP ${res.status}`);

    const data = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;
    if (!data?.length) return null;

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
      provider: "nominatim",
    };
  });
}

async function geocodeUncached(
  address: string,
  city: string | undefined,
  prefer: "google" | "nominatim" | "auto"
): Promise<GeocodeResult | null> {
  const q = [address, city, "Việt Nam"].filter(Boolean).join(", ");
  const useGoogle =
    prefer === "google" || (prefer === "auto" && hasGoogleMapsKey());

  if (useGoogle && hasGoogleMapsKey()) {
    try {
      const result = await geocodeGoogle(q);
      if (result) return result;
    } catch (err) {
      if (prefer === "google") throw err;
      console.warn("Google Geocoding failed, fallback Nominatim:", err);
    }
  }

  if (prefer === "google" && !hasGoogleMapsKey()) {
    throw new Error("Chưa cấu hình VITE_GOOGLE_MAPS_API_KEY trong file .env");
  }

  return geocodeNominatim(q);
}

/**
 * Geocode có cache + dedupe request đang chạy cùng query.
 */
export async function geocodeAddress(
  address: string,
  city?: string,
  prefer: "google" | "nominatim" | "auto" = "auto"
): Promise<GeocodeResult | null> {
  const raw = address?.trim();
  if (!raw) return null;

  const cacheKey = `${prefer}|${normalizeQuery(raw, city)}`;
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    if (cached.result) {
      return { ...cached.result, fromCache: true };
    }
    return null;
  }

  const existing = inflight.get(cacheKey);
  if (existing) return existing;

  const promise = geocodeUncached(raw, city, prefer)
    .then((result) => {
      memoryCache.set(cacheKey, { result, at: Date.now() });
      return result;
    })
    .finally(() => {
      inflight.delete(cacheKey);
    });

  inflight.set(cacheKey, promise);
  return promise;
}
