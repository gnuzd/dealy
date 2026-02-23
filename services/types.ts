import { NETWORKS } from "./constants";

export interface Env {
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

export interface AffiliateNetwork {
  name: string;
  apiBase: string;
  generateDeepLink: (cleanUrl: string, pubId: string) => string;
}

export interface LocaleConfig {
  networkKey: keyof typeof NETWORKS;
  atKeyEnvKey: keyof Env;
  pubIdEnvKey: keyof Env;
  domains: string[];
}

export interface AffiliateNetwork {
  name: string;
  apiBase: string;
  generateDeepLink: (cleanUrl: string, pubId: string) => string;
}
