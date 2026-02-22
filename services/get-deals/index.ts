// ─── Types ────────────────────────────────────────────────────────────────────

interface Env {
  // Accesstrade access key per locale — wrangler secret put AT_KEY_VN
  AT_KEY_VN?: string;
  AT_KEY_TH?: string;
  AT_KEY_ID?: string;
  AT_KEY_MY?: string;
  AT_KEY_SG?: string;
  AT_KEY_PH?: string;
  // Deep link pub ID per locale — wrangler secret put PUB_ID_VN
  PUB_ID_VN?: string;
  PUB_ID_TH?: string;
  PUB_ID_ID?: string;
  PUB_ID_MY?: string;
  PUB_ID_SG?: string;
  PUB_ID_PH?: string;
}

interface AffiliateNetwork {
  name: string;
  apiBase: string;
  generateDeepLink: (cleanUrl: string, pubId: string) => string;
}

interface LocaleConfig {
  networkKey: keyof typeof NETWORKS;
  atKeyEnvKey: keyof Env;
  pubIdEnvKey: keyof Env;
  domains: string[];
}

/** Coupon từ GET /v1/offers_informations/coupon */
interface ATCoupon {
  id: string;
  name: string;
  content: string;
  image: string;
  link: string;
  aff_link: string;
  start_time: string;
  end_time: string;
  discount_value: number;
  discount_percentage: number;
  coupon_code: string;
  coupon_desc: string;
  categories: string[];
}

/** Voucher từ POST /v1/offers_informations/multi_link_2_coupons */
interface ATVoucher {
  id: string;
  name: string;
  content: string;
  image: string;
  link: string;
  aff_link: string;
  start_time: string;
  end_time: string;
  discount_value: number;
  discount_percentage: number;
  coupon_code: string;
  coupon_desc: string;
}

// ─── Affiliate Networks ───────────────────────────────────────────────────────

const NETWORKS: Record<string, AffiliateNetwork> = {
  accesstrade_vn: {
    name: "Accesstrade Vietnam",
    apiBase: "https://api.accesstrade.vn",
    generateDeepLink: (url, pubId) =>
      `https://go.isclix.com/deep_link/${pubId}?url=${encodeURIComponent(url)}&utm_source=dealy_app`,
  },
};

// ─── Locale Config ────────────────────────────────────────────────────────────

const LOCALES: Record<string, LocaleConfig> = {
  vn: {
    networkKey: "accesstrade_vn",
    atKeyEnvKey: "AT_KEY_VN",
    pubIdEnvKey: "PUB_ID_VN",
    domains: ["shopee.vn", "lazada.vn", "tiki.vn", "sendo.vn"],
  },
  th: {
    networkKey: "accesstrade_vn",
    atKeyEnvKey: "AT_KEY_TH",
    pubIdEnvKey: "PUB_ID_TH",
    domains: ["shopee.co.th", "lazada.co.th"],
  },
  id: {
    networkKey: "accesstrade_vn",
    atKeyEnvKey: "AT_KEY_ID",
    pubIdEnvKey: "PUB_ID_ID",
    domains: ["shopee.co.id", "lazada.co.id", "tokopedia.com"],
  },
  my: {
    networkKey: "accesstrade_vn",
    atKeyEnvKey: "AT_KEY_MY",
    pubIdEnvKey: "PUB_ID_MY",
    domains: ["shopee.com.my", "lazada.com.my"],
  },
  sg: {
    networkKey: "accesstrade_vn",
    atKeyEnvKey: "AT_KEY_SG",
    pubIdEnvKey: "PUB_ID_SG",
    domains: ["shopee.sg", "lazada.sg"],
  },
  ph: {
    networkKey: "accesstrade_vn",
    atKeyEnvKey: "AT_KEY_PH",
    pubIdEnvKey: "PUB_ID_PH",
    domains: ["shopee.ph", "lazada.com.ph"],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectLocale(url: string): string {
  const lower = url.toLowerCase();
  for (const [locale, config] of Object.entries(LOCALES)) {
    if (config.domains.some((d) => lower.includes(d))) return locale;
  }
  return "vn";
}

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function extractMerchant(url: string): string | null {
  try {
    const parts = new URL(url).hostname.split(".");
    return parts[0] === "www" ? (parts[1] ?? null) : parts[0];
  } catch {
    return null;
  }
}

function cleanUrl(rawUrl: string): string {
  try {
    const u = new URL(rawUrl);
    return u.origin + u.pathname;
  } catch {
    return rawUrl.split("?")[0];
  }
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

function jsonRes(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

// ─── Accesstrade API Calls ────────────────────────────────────────────────────

/**
 * GET /v1/offers_informations/coupon
 * Lấy danh sách coupon code đang active của merchant theo domain.
 */
async function fetchMerchantCoupons(
  domain: string,
  accessKey: string,
  apiBase: string,
  limit = 20,
): Promise<ATCoupon[]> {
  const url = `${apiBase}/v1/offers_informations/coupon?${new URLSearchParams({
    domain,
    status: "1",
    limit: String(limit),
  })}`;

  const res = await fetch(url, {
    headers: { Authorization: `Token ${accessKey}` },
  });
  console.log(res);

  const json: any = await res.json();
  return json?.data ?? [];
}

/**
 * POST /v1/offers_informations/multi_link_2_coupons
 * Lấy coupon/voucher áp dụng cho đúng URL sản phẩm người dùng paste vào.
 * Rate limit: 30 req/min. Max 5 URLs mỗi request.
 */
async function fetchLinkCoupons(
  productUrl: string,
  accessKey: string,
  apiBase: string,
): Promise<ATVoucher[]> {
  const res = await fetch(
    `${apiBase}/v1/offers_informations/multi_link_2_coupons`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${accessKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ URLS: productUrl }),
    },
  );

  const json: any = await res.json();
  // Response: [{ origin_url, list_voucher: [...], status }]
  const firstResult = Array.isArray(json) ? json[0] : null;
  return firstResult?.list_voucher ?? [];
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const { searchParams } = new URL(request.url);
    const originalUrl = searchParams.get("original_url");
    const pubIdParam = searchParams.get("pub_id");
    const localeParam = searchParams.get("locale");

    if (!originalUrl) {
      return jsonRes({ error: "Missing required param: original_url" }, 400);
    }

    // 1. Detect locale + config
    const locale =
      localeParam && LOCALES[localeParam]
        ? localeParam
        : detectLocale(originalUrl);
    const localeConfig = LOCALES[locale];
    const network = NETWORKS[localeConfig.networkKey];

    // 2. Resolve credentials
    const accessKey = "hEzAjidKxGnWmmd3HCJD1qS_3k7bMH9E";
    // const accessKey = (env[localeConfig.atKeyEnvKey] as string | undefined) ?? "";
    const pubId =
      pubIdParam ?? (env[localeConfig.pubIdEnvKey] as string | undefined);

    if (!pubId) {
      return jsonRes(
        {
          error: `No pub_id for locale "${locale}". Set secret: ${localeConfig.pubIdEnvKey}`,
        },
        400,
      );
    }

    const clean = cleanUrl(originalUrl);
    const domain = extractDomain(originalUrl);
    const merchant = extractMerchant(originalUrl);

    // 3. Generate deep link (instant — no network)
    const deepLink = network.generateDeepLink(clean, pubId);

    // 4. Fetch coupons from both endpoints in parallel
    let linkCoupons: ATVoucher[] = [];
    let merchantCoupons: ATCoupon[] = [];

    if (accessKey && domain) {
      const [linkResult, merchantResult] = await Promise.allSettled([
        // Coupon áp dụng đúng cho URL sản phẩm (Tìm kiếm theo link)
        fetchLinkCoupons(clean, accessKey, network.apiBase),
        // Coupon đang active của merchant này
        fetchMerchantCoupons(domain, accessKey, network.apiBase, 20),
      ]);

      if (linkResult.status === "fulfilled") {
        linkCoupons = linkResult.value;
      } else {
        console.error("[get-deals] fetchLinkCoupons error:", linkResult.reason);
      }

      if (merchantResult.status === "fulfilled") {
        merchantCoupons = merchantResult.value;
      } else {
        console.error(
          "[get-deals] fetchMerchantCoupons error:",
          merchantResult.reason,
        );
      }
    }

    return jsonRes({
      deep_link: deepLink,
      locale,
      network: network.name,
      merchant,
      original_url: clean,
      /** Coupon áp dụng trực tiếp cho URL sản phẩm (multi_link_2_coupons) */
      link_coupons: linkCoupons,
      /** Coupon đang active của merchant (offers_informations/coupon) */
      merchant_coupons: merchantCoupons,
    });
  },
};
