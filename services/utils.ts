import { LOCALES } from "./constants";

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export function jsonRes(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

export function detectLocale(url: string): string {
  const lower = url.toLowerCase();
  for (const [locale, config] of Object.entries(LOCALES)) {
    if (config.domains.some((d) => lower.includes(d))) return locale;
  }
  return "vn";
}

export function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function extractMerchant(url: string): string | null {
  try {
    const parts = new URL(url).hostname.split(".");
    return parts[0] === "www" ? (parts[1] ?? null) : parts[0];
  } catch {
    return null;
  }
}
