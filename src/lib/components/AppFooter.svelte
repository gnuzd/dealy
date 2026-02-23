<script lang="ts">
  let email = $state('');

  const cols = [
    {
      heading: 'Tính năng',
      links: ['Link Scanner', 'Deal Finder', 'Mã Giảm Giá', 'Hoa Hồng Affiliate', 'Thông Báo Giá'],
    },
    {
      heading: 'Hỗ trợ',
      links: ['Hướng dẫn sử dụng', 'Câu hỏi thường gặp', 'Đối tác Affiliate', 'API & Tích hợp'],
    },
    {
      heading: 'Công ty',
      links: ['Về Dealy', 'Blog', 'Tuyển dụng', 'Liên hệ'],
    },
  ];
</script>

<footer class="border-t border-base-content/8 bg-base-100 mt-auto">

  <!-- Main grid -->
  <div class="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">

    <!-- Brand col -->
    <div class="col-span-2 md:col-span-1">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-7 h-7 bg-base-content rounded-lg flex items-center justify-center flex-shrink-0">
          <span class="text-base-100 font-black text-xs leading-none">D</span>
        </div>
        <span class="font-bold text-base-content text-sm">Dealy</span>
      </div>
      <p class="text-xs text-base-content/50 leading-relaxed mb-3 max-w-[180px]">
        Tìm deal tốt nhất từ Shopee, Lazada, Tiki và hàng trăm sàn thương mại điện tử — tự động, miễn phí.
      </p>
      <p class="text-xs text-base-content/35">Affiliate Partner: Accesstrade</p>
    </div>

    <!-- Link cols -->
    {#each cols as col}
      <div class="col-span-1">
        <p class="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-3">{col.heading}</p>
        <ul class="flex flex-col gap-2">
          {#each col.links as link}
            <li>
              <button class="text-xs text-base-content/60 hover:text-base-content transition-colors text-left">
                {link}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/each}

    <!-- Newsletter col -->
    <div class="col-span-2 md:col-span-1">
      <p class="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-1">Nhận thông báo deal</p>
      <p class="text-xs text-base-content/45 mb-3 leading-relaxed">Deal mới mỗi ngày, thẳng vào email của bạn.</p>
      <div class="flex gap-1.5">
        <input
          class="input input-bordered input-xs flex-1 bg-base-100 text-xs"
          placeholder="email@example.com"
          type="email"
          bind:value={email}
        />
        <button class="btn btn-neutral btn-xs px-3">Theo dõi</button>
      </div>
    </div>

  </div>

  <!-- Bottom bar -->
  <div class="border-t border-base-content/8 px-6 py-3 max-w-5xl mx-auto flex items-center justify-between">
    <span class="text-xs text-base-content/35">© 2026 Dealy. Nền tảng săn deal thông minh.</span>
    <div class="flex items-center gap-4">
      <button class="text-xs text-base-content/35 hover:text-base-content/60 transition-colors">Chính sách bảo mật</button>
      <button class="text-xs text-base-content/35 hover:text-base-content/60 transition-colors">Điều khoản sử dụng</button>
      <button class="text-xs text-base-content/35 hover:text-base-content/60 transition-colors">Cookie</button>
    </div>
  </div>

</footer>
