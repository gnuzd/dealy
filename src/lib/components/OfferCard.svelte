<script lang="ts">
  import { ArrowRight, Copy, Check } from "lucide-svelte";
  import { fade, fly, scale } from "svelte/transition";
  import { getMerchantColor, generateAffiliateLink } from "$lib/constants";
  import type { Offer } from "$lib/types";

  const { data }: { data: Offer } = $props();

  let copied = $state(false);

  const copyCode = async (code: string) => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  };

  const formatDiscount = (text: string) => {
    // Matches: 50%, 50k, 50K, 50.000đ, 50,000VNĐ, 50.000 VNĐ, etc.
    const match = text.match(/(\d+%\s*|\d+[kK]|\d+[\.,]\d+\s*(?:VNĐ|đ|VND))/i);
    if (!match) return "HOT";
    return match[0].replace(/VNĐ|VND/i, "đ").trim().toUpperCase();
  };

  const getCleanTitle = (name: string) => {
    const discount = formatDiscount(name);
    if (discount === "HOT") return name;
    return name.replace(new RegExp(`GIẢM\\s*${discount.replace('%', '\\%')}`, 'i'), '').trim() 
           || name.replace(new RegExp(discount.replace('%', '\\%'), 'i'), '').trim();
  };
</script>

<div
  in:fly={{ y: 20, duration: 400, opacity: 0 }}
  class="relative group bg-white rounded-[2rem] p-1.5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
>
  <div class="flex gap-4 p-3 bg-slate-50/50 rounded-[1.75rem] border border-white h-32 items-center relative overflow-hidden">
    <!-- Subtle Background Brand Accent -->
    <div class="absolute -right-4 -top-10 w-32 h-32 rounded-full opacity-[0.03] blur-2xl {getMerchantColor(data.merchant)}"></div>

    <!-- Left: Brand Image -->
    <div class="w-24 h-24 flex-none rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center p-2.5 relative group-hover:scale-105 transition-transform duration-500 overflow-hidden">
      <img
        src={data.image}
        alt={data.merchant}
        class="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
        referrerpolicy="no-referrer"
      />
      <div class="absolute bottom-1 right-1">
        <div class="badge badge-primary badge-xs py-2 px-1.5 text-[7px] font-black italic tracking-tighter uppercase">Verified</div>
      </div>
    </div>

    <!-- Right: Info & Actions -->
    <div class="flex-1 min-w-0 h-full flex flex-col justify-between py-0.5">
      <div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full {getMerchantColor(data.merchant)} opacity-60"></span>
            {data.merchant} • {data.domain}
          </span>
          <span class="text-[9px] font-black text-error px-2 py-0.5 rounded-full bg-error/5 flex items-center gap-1">
            <span class="w-1 h-1 rounded-full bg-error animate-pulse"></span>
            {data.end_time.split("-").reverse().slice(0, 2).join("/")}
          </span>
        </div>
        
        <h3 class="text-[15px] font-black text-slate-900 leading-tight mb-0.5 italic truncate uppercase tracking-tight">
          Giảm {formatDiscount(data.name)}
        </h3>
        <p class="text-[11px] text-slate-500 font-medium line-clamp-1 truncate opacity-80">
          {data.content || getCleanTitle(data.name)}
        </p>
      </div>

      <div class="flex items-center gap-2 mt-auto">
        <!-- Coupon Code Button -->
        <button
          onclick={() => copyCode(data.coupons?.[0]?.coupon_code ?? "")}
          class="flex-1 bg-white border border-slate-200 rounded-xl px-3 h-9 flex items-center justify-between hover:border-primary transition-all duration-300 cursor-pointer group/code active:scale-95"
        >
          <div class="flex-1 min-w-0 text-left">
            <span class="text-[7px] block leading-none text-slate-400 font-black uppercase tracking-widest mb-0.5">Code</span>
            <span class="text-[12px] font-mono font-black text-slate-800 truncate block uppercase leading-none">
              {data.coupons?.[0]?.coupon_code || 'SĂN NGAY'}
            </span>
          </div>
          
          <div class="flex items-center justify-center ml-2 w-6 h-6 rounded-lg bg-slate-50 group-hover/code:bg-primary group-hover/code:text-white transition-colors">
            {#if copied}
              <div in:scale={{ duration: 200, start: 0.5 }}>
                <Check size={12} strokeWidth={4} />
              </div>
            {:else}
              <div in:scale={{ duration: 200, start: 0.5 }}>
                <Copy size={12} strokeWidth={3} />
              </div>
            {/if}
          </div>
        </button>

        <!-- Main Action Button -->
        <a
          href={generateAffiliateLink(data.link)}
          target="_blank"
          rel="noopener noreferrer"
          class="w-9 h-9 rounded-xl bg-black text-white flex items-center justify-center hover:bg-slate-800 hover:scale-110 active:scale-95 transition-all duration-300 flex-none shadow-lg shadow-black/10"
        >
          <ArrowRight size={18} strokeWidth={3} />
        </a>
      </div>
    </div>
  </div>
</div>