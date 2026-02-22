# **TÀI LIỆU BÀN GIAO DỰ ÁN: DEALY SUPER APP**

## **1\. Tổng quan dự án**

**Dealy** là một "Super App" hỗ trợ người dùng săn deal, lấy mã giảm giá và tạo link affiliate (tiếp thị liên kết) từ các sàn TMĐT lớn như Shopee và Lazada một cách tự động.

## **2\. Ngôn ngữ & Framework**

* **Frontend:** Sveltekit \+ Svelte5 \+ daisyUI \+ Tailwind CSS.
* **Icon Library:** Lucide-svelte.
* **Fonts:** Ưu tiên Sans-serif hiện đại (Inter, Slate).
* **Build:** Bun \+ adapter-static (SPA mode — SSR disabled cho Tauri).

## **3\. Triết lý Thiết kế (UI/UX)**

* **Phong cách:** Neobrutalism tối giản kết hợp với Modern SaaS.
* **Đặc điểm:**
  * Sử dụng các góc bo tròn lớn (rounded-3xl, rounded-\[2.5rem\]).
  * Shadow mềm mại (shadow-xl shadow-slate-200).
  * Typography cực mạnh (font-black, tracking-tighter).
  * Animation: fly, fade từ svelte/transition.
  * Border radius field theo DaisyUI config (không override trên btn/input).
* **Màu sắc chủ đạo:**
  * Shopee: Orange (from-orange-500 to-red-600).
  * Lazada: Navy Blue (from-blue-700 to-indigo-800).
  * Tiki: Cyan (from-sky-400 to-cyan-600).
  * Sendo: Rose (from-red-500 to-rose-600).
  * Hệ thống chung: DaisyUI "lofi" theme, Slate cho text phụ.

## **4\. Logic & Dữ liệu Quan trọng**

### **Affiliate Logic**

* **Pub ID:** 6919596271058314754 (Accesstrade Vietnam).
* **DeepLink Format:** `https://go.isclix.com/deep_link/${pubId}?url=${encodeURIComponent(cleanUrl)}&utm_source=dealy_app`
* **Deeplink được generate client-side ngay lập tức** — không chờ network.
* **Access Key (VN):** Lưu trong `.env` dưới dạng `PUBLIC_AT_ACCESS_KEY`.

### **Accesstrade API Endpoints**

| Endpoint | Method | Mục đích |
|----------|--------|----------|
| `/v1/products` | GET | Tìm sản phẩm theo keyword, sort price asc — dùng bởi compare Worker |

### **Trạng thái (States)**

* `activeTab`: Quản lý điều hướng (home, deals, coupons, account).
* `isLoggedIn`: Quản lý trạng thái người dùng.
* `showAuthModal` / `authMode`: Điều khiển modal đăng nhập/đăng ký.
* `items`: Danh sách search results (mỗi item = 1 lần paste link → keyword + products).

## **5\. Cấu trúc Components (Main App)**

### Frontend (`src/`)

| Component | Mô tả |
|-----------|-------|
| `routes/+layout.svelte` | Shell layout: Header, Sidebar, BottomNav, AuthModal. Sticky footer pattern với `min-h-full flex flex-col`. |
| `routes/+page.svelte` | Router tab: render LinkScanner / ProductList / placeholder theo activeTab. |
| `lib/store.svelte.ts` | Global store: platform, activeTab, auth state. |
| `lib/constants.ts` | Affiliate networks, merchant detection, deeplink generation. |
| `lib/components/LinkScanner.svelte` | **Core UI:** paste link → trích xuất keyword → so sánh giá tất cả sàn. |
| `lib/components/ProductList.svelte` | Danh sách deals từ PocketBase, real-time updates. |
| `lib/components/Header.svelte` | Top nav (desktop): tab text-only + Sign In / Sign Up buttons. |
| `lib/components/DesktopSidebar.svelte` | Sidebar (≥md): navigation tabs. |
| `lib/components/BottomNavigation.svelte` | Bottom nav (mobile/web, hidden desktop). |
| `lib/components/AuthModal.svelte` | Modal đăng nhập/đăng ký: bottom sheet mobile, centered desktop. |
| `lib/components/OfferCard.svelte` | Card sản phẩm trong ProductList. |
| `lib/components/Footer.svelte` | Footer, ẩn trên mobile (`hidden md:block`). |

### Services (Cloudflare Workers)

| Service | Port dev | Mô tả |
|---------|----------|-------|
| `services/scraper/` | — | Cron Worker: cào deals từ Accesstrade → lưu PocketBase. |
| `services/get-deals/` | 8787 | API Worker: deeplink + coupon (giữ lại nhưng không dùng trong UI). |
| `services/compare/` | 8788 | **API Worker chính:** trích xuất keyword từ URL → tìm sản phẩm, sort price asc. |

### Env Variables (`.env`)

```
PUBLIC_PB_URL=https://dealy.pockethost.io/
PUBLIC_AT_ACCESS_KEY=<accesstrade_key>
PUBLIC_COMPARE_URL=http://localhost:8788     # deployed: workers.dev URL
# PUBLIC_GET_DEALS_URL=http://localhost:8787  # không dùng trong UI hiện tại
```

### Worker Secrets (wrangler secret put)

```
# get-deals
AT_KEY_VN, AT_KEY_TH, AT_KEY_ID, AT_KEY_MY, AT_KEY_SG, AT_KEY_PH
PUB_ID_VN, PUB_ID_TH, PUB_ID_ID, PUB_ID_MY, PUB_ID_SG, PUB_ID_PH

# compare
AT_KEY_VN, AT_KEY_TH, AT_KEY_ID, AT_KEY_MY, AT_KEY_SG, AT_KEY_PH
```

## **6\. Luồng LinkScanner (Core Feature)**

```
User paste URL
  │
  ├─ [client-side, INSTANT]
  │    detectMerchant() → validate platform + gradient màu
  │    generateAffiliateLink() → deeplink hiển thị ngay
  │    → Deeplink card: Copy link + Mua ngay button
  │
  └─ [async, compare Worker]
       extractProductName(url) → keyword (regex Shopee/Tiki/Lazada/Sendo)
       GET /v1/products?keyword=...&status=1&sort=price_asc&limit=20
       → skeleton loading trong khi chờ
       → products[] sorted cheapest first
       → thumbnail · tên · merchant badge · giá VND
       → badge "Rẻ nhất" · badge "-X%" nếu có giảm giá
       → mỗi item là <a href=aff_link> (affiliate tracking)
```

## **7\. Tasks**

### ✅ Đã hoàn thành

- [x] Cấu trúc SvelteKit + Svelte 5 runes (`$state`, `$props`, `$derived`)
- [x] DaisyUI "lofi" theme, Tailwind v4, Neobrutalism design system
- [x] Responsive layout: mobile bottom nav / desktop sidebar / header
- [x] Sticky footer pattern (`min-h-full flex flex-col` inner wrapper)
- [x] Cấu trúc SvelteKit + Svelte 5 runes (`$state`, `$props`, `$derived`)
- [x] DaisyUI "lofi" theme, Tailwind v4, Neobrutalism design system
- [x] Responsive layout: mobile bottom nav / desktop sidebar / header
- [x] Sticky footer pattern (`min-h-full flex flex-col` inner wrapper)
- [x] `LinkScanner`: paste URL → deeplink instant (client-side) + skeleton comparison loading
- [x] `LinkScanner`: quét QR code via BarcodeDetector API
- [x] `LinkScanner`: hỗ trợ nhiều search cùng lúc (mỗi paste = 1 kết quả riêng)
- [x] `LinkScanner`: so sánh giá toàn sàn — thumbnail, badge "Rẻ nhất", giá VND, affiliate link
- [x] `AuthModal`: bottom sheet mobile, centered desktop, toggle sign in/sign up
- [x] `ProductList`: real-time PocketBase updates, ts-pattern fixed
- [x] Worker `compare`: extractProductName (Shopee/Tiki/Lazada/Sendo regex) → `/v1/products` search
- [x] Multi-locale support: VN / TH / ID / MY / SG / PH (cấu trúc mở rộng được)

### 🔄 Đang làm / Cần kiểm tra

- [ ] Verify Accesstrade endpoint `/v1/products` — response shape, field names, sort param
- [ ] Test `extractProductName` với link Shopee/Tiki/Lazada thật (regex có thể cần chỉnh)
- [ ] Deploy `compare` Worker lên Cloudflare, cập nhật `PUBLIC_COMPARE_URL` trong `.env`
- [ ] Set Worker secret: `wrangler secret put AT_KEY_VN` (trong thư mục `services/compare/`)

### 📋 Backlog

- [ ] **Auth thật:** Thay placeholder trong `AuthModal` bằng PocketBase auth API
- [ ] **Tab Coupons:** Lưu sản phẩm yêu thích vào LocalStorage hoặc PocketBase
- [ ] **Tab Account:** Hiển thị số dư hoa hồng thực từ Accesstrade API
- [ ] **Tab Deals:** Filter/search trong ProductList
- [ ] **So sánh nâng cao:** Thêm filter theo merchant, rating, khoảng giá
- [ ] **Tên sản phẩm chính xác hơn:** Thử dùng Accesstrade API để lấy tên thay vì parse URL slug
- [ ] **PWA:** Thêm service worker, manifest để cài đặt như app
- [ ] **Tauri build:** Test native desktop build

*Ghi chú: SPA mode (`ssr = false`) — không dùng `+server.ts` routes. Tất cả API calls qua Cloudflare Workers.*
