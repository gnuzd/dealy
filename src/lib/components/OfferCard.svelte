<script lang="ts">
  const { data } = $props();

  let copied = $state(false);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };

  // Hàm bóc tách giá trị giảm giá để hiển thị to
  const formatDiscount = (text: string) => {
    const match = text.match(/(\d+%\s*|\d+[kK]|\d+[\.,]\d+\s*VNĐ)/i);
    return match ? match[0].replace(/VNĐ/i, "đ") : "HOT";
  };

  const pubId = "6919596271058314754";

  function generateLink(productUrl: string) {
    const cleanUrl = productUrl.split("?")[0];
    return `https://go.isclix.com/deep_link/${pubId}?url=${encodeURIComponent(productUrl)}&utm_source=dealy_app`;
  }
</script>

<div
  class="relative flex w-full gap-3 bg-base-100 rounded-xl shadow-lg border border-base-200 group hover:shadow-2xl transition-all duration-300 overflow-hidden"
>
  <div
    class="relative w-28 flex-none flex flex-col items-center justify-center p-2 text-white
    {data.merchant === 'shopee'
      ? 'bg-gradient-to-br from-orange-500 to-red-600'
      : 'bg-gradient-to-br from-blue-600 to-indigo-700'}"
  >
    <div class="avatar online">
      <div
        class="w-14 h-14 rounded-full ring ring-white ring-offset-base-100 ring-offset-2 bg-white"
      >
        <img
          src={data.image}
          alt="shop-logo"
          class="object-contain p-1"
          referrerpolicy="no-referrer"
        />
      </div>
    </div>

    <div
      class="text-[10px] font-black mt-2 tracking-tighter uppercase opacity-90"
    >
      {data.merchant}
    </div>
  </div>
  <div class="flex flex-col justify-between py-2 z-10">
    {#each Array(5) as _}
      <div class="w-4 h-4 rounded-full bg-base-200 -mr-2 shadow-inner"></div>
    {/each}
  </div>

  <div class="flex-1 p-4 flex flex-col justify-between min-w-0 bg-white">
    <div class="flex justify-between items-center mb-1">
      <span
        class="text-[9px] font-bold text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 uppercase tracking-wider"
      >
        {data.domain}
      </span>
      <div class="flex items-center gap-1 text-[10px] font-bold text-error">
        <span class="relative flex h-2 w-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
          ></span>
        </span>
        Hạn: {data.end_time.split("-").reverse().slice(0, 2).join("/")}
      </div>
    </div>

    <div class="mb-2">
      <h3 class="text-lg font-black text-slate-800 leading-none truncate">
        GIẢM {formatDiscount(data.name)}
      </h3>
      <p
        class="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-1 font-medium italic"
      >
        {data.content}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <div
        class="flex-1 flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200"
      >
        <span class="text-[9px] font-bold text-slate-400 px-1 uppercase"
          >CODE:</span
        >
        <span class="text-xs font-mono font-black text-primary flex-1 truncate">
          {data.coupons?.[0]?.coupon_code || "SĂN NGAY"}
        </span>
        <button
          class="btn btn-primary btn-xs lowercase text-[10px] h-6 min-h-0"
          onclick={() => copyCode(data.coupons?.[0]?.coupon_code)}
        >
          {copied ? "OK" : "COPY"}
        </button>
      </div>

      <a
        href={generateLink(data.link)}
        target="_blank"
        title={data.name}
        class="btn btn-square btn-outline btn-sm border-slate-200 hover:bg-primary hover:border-primary group/btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 group-hover/btn:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </a>
    </div>
  </div>
</div>
