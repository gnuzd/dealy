import { AffiliateNetwork, LocaleConfig } from "./types";

export const LOCALES: Record<string, LocaleConfig> = {
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

// ─── Affiliate Networks ───────────────────────────────────────────────────────

export const NETWORKS: Record<string, AffiliateNetwork> = {
  accesstrade_vn: {
    name: "Accesstrade Vietnam",
    apiBase: "https://api.accesstrade.vn",
    generateDeepLink: (url, pubId) =>
      `https://go.isclix.com/deep_link/${pubId}?url=${encodeURIComponent(url)}&utm_source=dealy_app`,
  },
};
