<script lang="ts">
  import { ArrowRight } from "lucide-svelte";
  import { fade } from "svelte/transition";
  import { fly } from "svelte/transition";
  import { getMerchantColor, generateAffiliateLink } from "$lib/constants";
  import type { Offer } from "$lib/types";

  const { data }: { data: Offer } = $props();

  let copied = $state(false);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };

  const formatDiscount = (text: string) => {
    const match = text.match(/(\d+%\s*|\d+[kK]|\d+[\.,]\d+\s*VNĐ)/i);
    return match ? match[0].replace(/VNĐ/i, "đ") : "HOT";
  };
</script>

<div
  in:fly={{ y: 16, duration: 280, opacity: 0 }}
  class="relative flex w-full gap-3 bg-base-100 rounded-3xl shadow-xl shadow-slate-200 border border-base-200 group hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
>
  <!-- Merchant strip -->
  <div
    class="relative w-28 flex-none flex flex-col items-center justify-center p-2 text-white {getMerchantColor(data.merchant)}"
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

    <div class="text-[10px] font-black mt-2 tracking-tighter uppercase opacity-90">
      {data.merchant}
    </div>
  </div>

  <!-- Ticket perforation dots -->
  <div class="flex flex-col justify-between py-2 z-10">
    {#each Array(5) as _}
      <div class="w-4 h-4 rounded-full bg-base-200 -mr-2 shadow-inner"></div>
    {/each}
  </div>

  <!-- Content -->
  <div class="flex-1 p-4 flex flex-col justify-between min-w-0 bg-white">
    <div class="flex justify-between items-center mb-1">
      <span
        class="text-[9px] font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-100 uppercase tracking-wider"
      >
        {data.domain}
      </span>
      <div class="flex items-center gap-1 text-[10px] font-bold text-error">
        <span class="relative flex h-2 w-2">
          <span
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
          ></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        Hạn: {data.end_time.split("-").reverse().slice(0, 2).join("/")}
      </div>
    </div>

    <div class="mb-2">
      <h3 class="text-lg font-black text-slate-800 tracking-tighter leading-none truncate">
        GIẢM {formatDiscount(data.name)}
      </h3>
      <p class="text-[11px] text-slate-500 line-clamp-2 leading-tight mt-1 font-medium italic">
        {data.content}
      </p>
    </div>

    <div class="flex items-center gap-2">
      <div
        class="flex-1 flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200"
      >
        <span class="text-[9px] font-bold text-slate-400 px-1 uppercase">CODE:</span>
        <span class="text-xs font-mono font-black text-primary flex-1 truncate">
          {data.coupons?.[0]?.coupon_code || "SĂN NGAY"}
        </span>
        <button
          class="btn btn-primary btn-xs lowercase text-[10px] h-6 min-h-0"
          onclick={() => copyCode(data.coupons?.[0]?.coupon_code ?? "")}
        >
          {#if copied}
            <span in:fade={{ duration: 150 }}>OK ✓</span>
          {:else}
            <span in:fade={{ duration: 150 }}>COPY</span>
          {/if}
        </button>
      </div>

      <a
        href={generateAffiliateLink(data.link)}
        target="_blank"
        rel="noopener noreferrer"
        title={data.name}
        class="btn btn-square btn-outline btn-sm border-slate-200 hover:bg-primary hover:border-primary group/btn"
      >
        <ArrowRight size={16} class="group-hover/btn:text-white transition-colors" />
      </a>
    </div>
  </div>
</div>
