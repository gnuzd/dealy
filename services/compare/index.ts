// ─── Types ────────────────────────────────────────────────────────────────────

interface Env {
  AT_KEY_VN?: string;
  AT_KEY_TH?: string;
  AT_KEY_ID?: string;
  AT_KEY_MY?: string;
  AT_KEY_SG?: string;
  AT_KEY_PH?: string;
}

/** Product item từ GET /v1/products */
interface ATProduct {
  id: string;
  name: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  discount_value: number;
  merchant: string;
  domain: string;
  /** Link gốc của sản phẩm */
  link: string;
  /** Affiliate link đã kèm tracking */
  aff_link: string;
  image: string;
  status: number;
}

// ─── Locale → Access Key ──────────────────────────────────────────────────────

const LOCALE_DOMAINS: Record<string, string[]> = {
  vn: ["shopee.vn", "lazada.vn", "tiki.vn", "sendo.vn"],
  th: ["shopee.co.th", "lazada.co.th"],
  id: ["shopee.co.id", "lazada.co.id", "tokopedia.com"],
  my: ["shopee.com.my", "lazada.com.my"],
  sg: ["shopee.sg", "lazada.sg"],
  ph: ["shopee.ph", "lazada.com.ph"],
};

const AT_API_BASE = "https://api.accesstrade.vn";

function detectLocale(url: string): string {
  const lower = url.toLowerCase();
  for (const [locale, domains] of Object.entries(LOCALE_DOMAINS)) {
    if (domains.some((d) => lower.includes(d))) return locale;
  }
  return "vn";
}

function getAccessKey(locale: string, env: Env): string {
  const map: Record<string, keyof Env> = {
    vn: "AT_KEY_VN",
    th: "AT_KEY_TH",
    id: "AT_KEY_ID",
    my: "AT_KEY_MY",
    sg: "AT_KEY_SG",
    ph: "AT_KEY_PH",
  };
  return (env[map[locale] ?? "AT_KEY_VN"] as string | undefined) ?? "";
}

// ─── Product Name Extraction ──────────────────────────────────────────────────

/**
 * Trích xuất tên sản phẩm từ URL:
 * - Shopee:  /Ten-San-Pham-i.{shop_id}.{item_id}
 * - Tiki:    /ten-san-pham-p{id}.html
 * - Lazada:  /products/ten-san-pham-i{id}-s{sku}.html
 * - Sendo:   /ten-san-pham-{id}.html
 */
function extractProductName(rawUrl: string): string {
  try {
    const { hostname, pathname } = new URL(rawUrl);

    let slug = "";

    if (hostname.includes("shopee")) {
      // /Ten-San-Pham-i.123456.987654321
      const m = pathname.match(/^\/(.+?)-i\.\d+\.\d+/);
      slug = m?.[1] ?? "";
    } else if (hostname.includes("tiki")) {
      // /ten-san-pham-p987654321.html
      const m = pathname.match(/^\/(.+?)-p\d+(?:\.html)?$/);
      slug = m?.[1] ?? "";
    } else if (hostname.includes("lazada")) {
      // /products/ten-san-pham-i123456-s654321.html
      const m = pathname.match(/\/products\/(.+?)(?:-i\d+|-s\d+)/);
      slug = m?.[1] ?? "";
    } else if (hostname.includes("sendo")) {
      // /ten-san-pham-12345678.html
      const m = pathname.match(/^\/(.+?)-\d+(?:\.html)?$/);
      slug = m?.[1] ?? "";
    } else {
      // Fallback: last path segment, strip trailing IDs
      const parts = pathname.split("/").filter(Boolean);
      slug = (parts[parts.length - 1] ?? "").replace(/-\d+$/, "");
    }

    return slug.replace(/[-_]/g, " ").trim();
  } catch {
    return "";
  }
}

// ─── Accesstrade Product Search ───────────────────────────────────────────────

/**
 * GET /v1/products
 * Tìm sản phẩm theo keyword, sort price asc.
 */
async function searchProducts(
  keyword: string,
  accessKey: string,
  limit = 20,
): Promise<ATProduct[]> {
  const url = `${AT_API_BASE}/v1/products?${new URLSearchParams({
    keyword,
    status: "1",
    limit: String(limit),
    sort: "price_asc",
  })}`;

  const res = await fetch(url, {
    headers: { Authorization: `Token ${accessKey}` },
  });

  if (!res.ok) {
    throw new Error(`Accesstrade /v1/products ${res.status}`);
  }

  const json: any = await res.json();
  // Response shape: { data: ATProduct[] } or ATProduct[]
  const items: ATProduct[] = json?.data ?? (Array.isArray(json) ? json : []);

  // Sort price ascending client-side as safety net
  return items.sort((a, b) => a.price - b.price);
}

// ─── CORS & Response Helpers ──────────────────────────────────────────────────

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: CORS });
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }

    const { searchParams } = new URL(request.url);
    const productUrl = searchParams.get("url") ?? "";

    if (!productUrl) {
      return json({ error: "Missing required param: url" }, 400);
    }

    const locale = detectLocale(productUrl);
    const accessKey = getAccessKey(locale, env);

    if (!accessKey) {
      return json({ error: `No access key for locale "${locale}"` }, 400);
    }

    // Trích xuất tên sản phẩm từ URL
    const productName = extractProductName(productUrl);
    if (!productName) {
      return json({ error: "Could not extract product name from URL" }, 400);
    }

    try {
      const products = await searchProducts(productName, accessKey);

      return json({
        keyword: productName,
        locale,
        total: products.length,
        products,
      });
    } catch (err: any) {
      console.error("[compare] searchProducts error:", err?.message);
      return json({ error: "Failed to fetch products" }, 502);
    }
  },
};
