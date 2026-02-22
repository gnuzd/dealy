export type Platform = "web" | "desktop" | "mobile";

export type Tab = "home" | "deals" | "coupons" | "account";

export interface Coupon {
  id?: string;
  coupon_code: string;
  description?: string;
}

export interface Offer {
  id: string;
  name: string;
  content: string;
  link: string;
  image: string;
  merchant: string;
  domain: string;
  end_time: string;
  coupons?: Coupon[];
  country_code?: string;
  created: string;
  updated: string;
}
