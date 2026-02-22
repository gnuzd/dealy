<script lang="ts">
  import store from "$lib/store.svelte";
</script>

<!-- hidden md:block: ẩn trên mobile web, hiện từ tablet trở lên -->
{#if store.platform === "web"}
  <footer class="footer p-10 text-base-content mt-20 hidden md:block">
    <div class="flex w-full gap-8">
      <!-- Branding -->
      <aside class="flex-1 min-w-[160px]">
        <div class="flex items-center gap-2 mb-4">
          <div
            class="w-8 h-8 bg-primary text-primary-content rounded-md flex items-center justify-center font-black text-sm"
          >
            D
          </div>
          <span class="font-black tracking-tighter text-lg">Dealy</span>
        </div>
        <p class="text-sm text-base-content/60 leading-relaxed max-w-[200px]">
          Tìm deal tốt nhất từ Shopee, Lazada, Tiki và hàng trăm sàn thương mại điện tử — tự động, miễn phí.
        </p>
        <p class="text-xs text-base-content/40 mt-4 font-medium">
          Affiliate Partner: Accesstrade
        </p>
      </aside>

      <!-- Tính năng -->
      <ul class="flex-1">
        <li>
          <h6 class="footer-title opacity-100 font-black text-primary text-xs uppercase tracking-wider mb-3">
            Tính năng
          </h6>
        </li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Link Scanner</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Deal Finder</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Mã Giảm Giá</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Hoa Hồng Affiliate</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Thông Báo Giá</a></li>
      </ul>

      <!-- Hỗ trợ -->
      <ul class="flex-1">
        <li>
          <h6 class="footer-title opacity-100 font-black text-primary text-xs uppercase tracking-wider mb-3">
            Hỗ trợ
          </h6>
        </li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Hướng dẫn sử dụng</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Câu hỏi thường gặp</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Đối tác Affiliate</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">API & Tích hợp</a></li>
      </ul>

      <!-- Công ty -->
      <ul class="flex-1">
        <li>
          <h6 class="footer-title opacity-100 font-black text-primary text-xs uppercase tracking-wider mb-3">
            Công ty
          </h6>
        </li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Về Dealy</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Blog</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Tuyển dụng</a></li>
        <li><a href="/" class="link link-hover text-sm text-base-content/70">Liên hệ</a></li>
      </ul>

      <!-- Newsletter -->
      <div class="flex-1 min-w-[220px]">
        <h6 class="footer-title opacity-100 font-black text-primary text-xs uppercase tracking-wider mb-3">
          Nhận thông báo deal
        </h6>
        <p class="text-xs text-base-content/50 mb-3">
          Deal mới mỗi ngày, thẳng vào email của bạn.
        </p>
        <div class="join">
          <input
            type="email"
            placeholder="email@example.com"
            class="input input-bordered join-item input-sm bg-base-200 w-full"
          />
          <button class="btn btn-primary btn-sm join-item font-semibold">Theo dõi</button>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="flex items-center justify-between w-full pt-6 border-t border-base-200">
      <p class="text-xs text-base-content/40">
        © 2026 Dealy. Nền tảng săn deal thông minh.
      </p>
      <nav class="flex gap-4">
        <a href="/" class="link link-hover text-xs text-base-content/40">Chính sách bảo mật</a>
        <a href="/" class="link link-hover text-xs text-base-content/40">Điều khoản sử dụng</a>
        <a href="/" class="link link-hover text-xs text-base-content/40">Cookie</a>
      </nav>
    </div>
  </footer>
{/if}
