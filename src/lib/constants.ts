// ─── Affiliate Networks ──────────────────────────────────────────────────────
// Extensible: thêm network mới (CJ, Awin, Impact, v.v.) để support global

export interface AffiliateNetwork {
  name: string;
  generateLink: (productUrl: string, pubId: string) => string;
}

const ACCESSTRADE: AffiliateNetwork = {
  name: "Accesstrade",
  generateLink: (url, pubId) =>
    `https://go.isclix.com/deep_link/${pubId}?url=${encodeURIComponent(url)}&utm_source=dealy_app`,
};

// TODO: thêm network cho các thị trường khác
// const IMPACT_RADIUS: AffiliateNetwork = { name: "Impact", generateLink: ... };
// const CJ_AFFILIATE: AffiliateNetwork = { name: "CJ", generateLink: ... };

export const AFFILIATE_PUB_ID = "6919596271058314754";

/** Chọn affiliate network dựa trên URL sản phẩm (TLD, domain, v.v.) */
function getAffiliateNetwork(_productUrl: string): AffiliateNetwork {
  // Hiện tại: tất cả qua Accesstrade Vietnam
  // Future: kiểm tra TLD (.th → Accesstrade TH, .id → network khác, v.v.)
  return ACCESSTRADE;
}

export function generateAffiliateLink(productUrl: string): string {
  const cleanUrl = productUrl.split("?")[0];
  return getAffiliateNetwork(cleanUrl).generateLink(cleanUrl, AFFILIATE_PUB_ID);
}

// ─── Merchant Detection ───────────────────────────────────────────────────────

interface MerchantInfo {
  name: string;
  gradient: string; // Tailwind gradient suffix (dùng với bg-gradient-to-br)
}

const MERCHANTS: Record<string, MerchantInfo> = {
  "shopee.vn": { name: "shopee", gradient: "from-orange-500 to-red-600" },
  "shopee.com": { name: "shopee", gradient: "from-orange-500 to-red-600" },
  "lazada.vn": { name: "lazada", gradient: "from-blue-700 to-indigo-800" },
  "lazada.com": { name: "lazada", gradient: "from-blue-700 to-indigo-800" },
  "tiki.vn": { name: "tiki", gradient: "from-sky-400 to-cyan-600" },
  "sendo.vn": { name: "sendo", gradient: "from-red-500 to-rose-600" },
  "shopee.sg": { name: "shopee", gradient: "from-orange-500 to-red-600" },
  "shopee.ph": { name: "shopee", gradient: "from-orange-500 to-red-600" },
  "shopee.com.my": { name: "shopee", gradient: "from-orange-500 to-red-600" },
  "shopee.co.th": { name: "shopee", gradient: "from-orange-500 to-red-600" },
  "lazada.sg": { name: "lazada", gradient: "from-blue-700 to-indigo-800" },
  "lazada.com.my": { name: "lazada", gradient: "from-blue-700 to-indigo-800" },
  "lazada.co.th": { name: "lazada", gradient: "from-blue-700 to-indigo-800" },
  "lazada.com.ph": { name: "lazada", gradient: "from-blue-700 to-indigo-800" },
};

export function detectMerchant(url: string) {
  const lower = url.toLowerCase();
  for (const [domain, info] of Object.entries(MERCHANTS)) {
    if (lower.includes(domain)) {
      return { domain, ...info };
    }
  }
  return null;
}

/** Trả về Tailwind bg class đầy đủ cho merchant — dùng trong OfferCard */
export function getMerchantColor(merchant: string): string {
  const entry = Object.values(MERCHANTS).find((m) => m.name === merchant.toLowerCase());
  return entry
    ? `bg-gradient-to-br ${entry.gradient}`
    : "bg-gradient-to-br from-blue-600 to-indigo-700";
}
