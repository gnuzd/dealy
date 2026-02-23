export type Platform = "web" | "desktop" | "mobile";

export type Tab = "home" | "deals" | "voucher" | "profile";

export interface Coupon {
  coupon_code: string;
}

export interface Offer {
  id: string;
  name: string;
  content: string;
  merchant: string;
  domain: string;
  link: string;
  image: string;
  end_time: string;
  coupons?: Coupon[];
}

export interface ToastMessage {
  id: number;
  message: string;
  type: "info" | "success" | "error" | "warning";
}
