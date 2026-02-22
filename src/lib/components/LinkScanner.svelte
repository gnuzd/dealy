<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import {
    Search,
    QrCode,
    Copy,
    ShoppingCart,
    X,
    CheckCircle2,
    AlertCircle,
    TrendingDown,
    ExternalLink,
    Share2,
  } from "lucide-svelte";
  import { PUBLIC_COMPARE_URL } from "$env/static/public";
  import {
    detectMerchant,
    generateAffiliateLink,
    AFFILIATE_PUB_ID,
    getMerchantColor,
  } from "$lib/constants";
  import store from '$lib/store.svelte';

  // Trích xuất tên sản phẩm từ URL slug (client-side, không cần network)
  function extractNameFromUrl(rawUrl: string): string {
    try {
      const { hostname, pathname } = new URL(rawUrl);
      let slug = "";
      if (hostname.includes("shopee")) {
        slug = pathname.match(/^\/(.+?)-i\.\d+\.\d+/)?.[1] ?? "";
      } else if (hostname.includes("tiki")) {
        slug = pathname.match(/^\/(.+?)-p\d+(?:\.html)?$/)?.[1] ?? "";
      } else if (hostname.includes("lazada")) {
        slug = pathname.match(/\/products\/(.+?)(?:-i\d+|-s\d+)/)?.[1] ?? "";
      } else if (hostname.includes("sendo")) {
        slug = pathname.match(/^\/(.+?)-\d+(?:\.html)?$/)?.[1] ?? "";
      }
      if (!slug) {
        const parts = pathname.split("/").filter(Boolean);
        slug = (parts[parts.length - 1] ?? "").replace(/-\d+$/, "");
      }

      return decodeURIComponent(slug).replace(/[-_]/g, " ").trim();
    } catch {
      return "";
    }
  }

  // ─── Types ───────────────────────────────────────────────────────────────────

  interface ATProduct {
    id: string;
    name: string;
    price: number;
    original_price: number;
    discount_percentage: number;
    merchant: string;
    domain: string;
    link: string;
    aff_link: string;
    image: string;
  }

  interface SearchItem {
    id: string;
    originalUrl: string;
    merchant: string;
    bgClass: string;
    /** Generated client-side instantly — never waits for network */
    affiliateLink: string;
    /** Tên sản phẩm — từ URL slug ngay lập tức, cập nhật từ API sau */
    previewName: string;
    /** Ảnh thumbnail — trống cho đến khi compare trả về */
    previewImage: string;
    loading: boolean;
    keyword: string;
    products: ATProduct[];
    error: boolean;
  }

  // ─── State ───────────────────────────────────────────────────────────────────

  let url = $state("");
  let scanning = $state(false);
  let inputError = $state<string | null>(null);
  let items = $state<SearchItem[]>([]);
  let copiedLink = $state<string | null>(null);
  let fileInput: HTMLInputElement;

  const PLATFORMS = [
    { name: "Shopee", cls: "bg-orange-100 text-orange-700" },
    { name: "Lazada", cls: "bg-blue-100 text-blue-700" },
    { name: "Tiki", cls: "bg-cyan-100 text-cyan-700" },
    { name: "Sendo", cls: "bg-red-100 text-red-700" },
  ];

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  function uid() {
    return Math.random().toString(36).slice(2, 9);
  }

  function updateItem(id: string, patch: Partial<SearchItem>) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx !== -1) items[idx] = { ...items[idx], ...patch };
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link);
    copiedLink = link;
    setTimeout(() => (copiedLink = null), 2500);
  }

  async function shareLink(item: SearchItem) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.previewName || "Săn deal cùng Dealy",
          text: `Săn deal giá tốt: ${item.previewName}`,
          url: item.affiliateLink,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      // Fallback for browsers that do not support the Web Share API
      store.showToast('Chia sẻ không được hỗ trợ. Đã sao chép link!', 'info');
      await copyLink(item.affiliateLink);
    }
  }

  // ─── Scan → Compare ──────────────────────────────────────────────────────────

  async function scan() {
    const trimmed = url.trim();
    if (!trimmed || scanning) return;

    inputError = null;
    scanning = true;

    const merchant = detectMerchant(trimmed);
    if (!merchant) {
      inputError =
        "Link không được hỗ trợ. Thử link từ Shopee, Lazada, Tiki hoặc Sendo.";
      scanning = false;
      return;
    }

    const item: SearchItem = {
      id: uid(),
      originalUrl: trimmed,
      merchant: merchant.name,
      bgClass: `bg-gradient-to-br ${merchant.gradient}`,
      affiliateLink: generateAffiliateLink(trimmed),
      loading: true,
      keyword: "",
      previewName: extractNameFromUrl(trimmed),
      previewImage: "",
      products: [],
      error: false,
    };

    items = [item, ...items];
    url = "";
    scanning = false;

    const itemId = item.id;
    try {
      const params = new URLSearchParams({ url: trimmed });
      const res = await fetch(`${PUBLIC_COMPARE_URL}?${params}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();

      const products = data.products ?? [];
      const firstProduct = products[0];

      updateItem(itemId, {
        keyword: data.keyword ?? "",
        products,
        previewName: firstProduct?.name || item.previewName,
        previewImage: firstProduct?.image || "",
        loading: false,
      });
    } catch {
      updateItem(itemId, { loading: false, error: true });
    }
  }

  function removeItem(id: string) {
    items = items.filter((i) => i.id !== id);
  }

  // ─── QR ──────────────────────────────────────────────────────────────────────

  async function handleQRFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!("BarcodeDetector" in window)) {
      inputError =
        "Trình duyệt chưa hỗ trợ quét QR. Vui lòng dùng Chrome hoặc Edge.";
      fileInput.value = "";
      return;
    }

    scanning = true;
    inputError = null;

    try {
      const bitmap = await createImageBitmap(file);
      // @ts-expect-error — BarcodeDetector: Chrome/Edge/Android Chrome
      const detector = new BarcodeDetector({ formats: ["qr_code"] });
      const barcodes = await detector.detect(bitmap);

      if (!barcodes.length) {
        inputError = "Không tìm thấy mã QR trong ảnh.";
        scanning = false;
        return;
      }

      url = barcodes[0].rawValue;
      await scan();
    } catch {
      inputError = "Không thể đọc mã QR. Vui lòng thử lại.";
      scanning = false;
    } finally {
      fileInput.value = "";
    }
  }
</script>

<!-- Hidden file input -->
<input
  bind:this={fileInput}
  type="file"
  accept="image/*"
  capture="environment"
  class="hidden"
  onchange={handleQRFile}
/>

<!-- Hidden file input -->
<input
  bind:this={fileInput}
  type="file"
  accept="image/*"
  capture="environment"
  class="hidden"
  onchange={handleQRFile}
/>

<div class="flex-1 w-full max-w-2xl mx-auto">
  {#if items.length === 0}
    <!-- ── Hero ── -->
    <div
      class="flex-1 flex flex-col items-center justify-center gap-6 px-2 min-h-[60vh]"
    >
      <div
        class="btn btn-primary btn-square pointer-events-none w-20 h-20 text-4xl font-black shadow-xl shadow-primary/20"
      >
        D
      </div>

      <div class="text-center">
        <h1 class="font-black text-3xl tracking-tighter">
          Săn Deal Thông Minh
        </h1>
        <p
          class="text-sm text-slate-500 mt-2 max-w-[280px] mx-auto leading-relaxed"
        >
          Dán link sản phẩm từ Shopee, Lazada... để tạo link affiliate & so sánh
          giá ngay.
        </p>
      </div>

      <div
        class="card bg-base-100 shadow-xl shadow-slate-200 border border-base-200 w-full rounded-box"
      >
        <div class="card-body p-6 gap-4">
          {@render inputRow()}

          {#if inputError}
            <div
              in:fade={{ duration: 150 }}
              class="flex items-center gap-2 text-error text-xs font-bold px-1"
            >
              <AlertCircle size={14} />
              {inputError}
            </div>
          {/if}

          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span
              class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >
              HỖ TRỢ:
            </span>
            {#each PLATFORMS as p}
              <span
                class="badge badge-sm font-bold text-[9px] rounded-full {p.cls} border-none"
                >{p.name}</span
              >
            {/each}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <!-- ── Results ── -->
    <div class="flex flex-col gap-8 pb-10">
      <!-- Compact input -->
      <div
        class="flex flex-col gap-2 bg-base-100/90 backdrop-blur-md sticky top-0 z-20 py-4 px-1 border-b border-base-200/50"
      >
        {@render inputRow()}
        {#if inputError}
          <div
            in:fade={{ duration: 150 }}
            class="flex items-center gap-1.5 text-error text-xs font-bold px-1"
          >
            <AlertCircle size={13} />
            {inputError}
          </div>
        {/if}
      </div>

      <!-- Search result items -->
      {#each items as item (item.id)}
        <div in:fly={{ y: 20, duration: 300 }} class="flex flex-col gap-4">
          <!-- Deeplink Card [MINIMALIST & CLEAN - FIXED BUTTONS] -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link Affiliate</span>
                    {#if item.loading}
                    <span class="loading loading-dots loading-xs text-primary opacity-50"></span>
                    {/if}
                </div>
                <button class="btn btn-ghost btn-xs btn-circle hover:bg-slate-100" onclick={() => removeItem(item.id)}>
                    <X size={14} class="text-slate-400"/>
                </button>
            </div>

            <div class="border border-slate-200 rounded-2xl p-4 flex flex-col gap-4">
                <div class="flex gap-4">
                    <div class="w-20 h-20 shrink-0 {getMerchantColor(item.merchant) ?? 'bg-slate-50'} rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden">
                        {#if item.previewImage}
                            <img src={item.previewImage} alt={item.previewName} class="w-full h-full object-cover" />
                        {:else if item.loading}
                            <div class="loading loading-spinner text-white"></div>
                        {:else}
                            <span class="font-black text-xl text-white uppercase">
                                {item.merchant[0]}
                            </span>
                        {/if}
                    </div>
                    <div class="flex-1 min-w-0 flex flex-col justify-center">
                        <span class="font-black text-sm {getMerchantColor(item.merchant)?.replace('bg-', 'text-') ?? 'text-slate-800'} mb-1 uppercase">{item.merchant}</span>
                        <h3 class="font-bold text-slate-800 text-base line-clamp-2 leading-tight">
                            {item.previewName || "Đang lấy thông tin sản phẩm..."}
                        </h3>
                    </div>
                </div>
                <div class="grid grid-cols-4 gap-2">
                    <a href={item.affiliateLink} target="_blank" rel="noopener noreferrer" class="col-span-2 btn btn-neutral h-11 text-white font-bold text-sm">
                        <span>Mua Ngay</span>
                        <ExternalLink size={16} />
                    </a>
                    <button onclick={() => copyLink(item.affiliateLink)} class="btn btn-outline border-slate-200 h-11" aria-label="Copy Link">
                        {#if copiedLink === item.affiliateLink}
                            <CheckCircle2 size={18} class="text-success"/>
                        {:else}
                            <Copy size={18} />
                        {/if}
                    </button>
                    <button onclick={() => shareLink(item)} class="btn btn-outline border-slate-200 h-11" aria-label="Share Link">
                        <Share2 size={18} />
                    </button>
                </div>
            </div>
          </div>

          <!-- Comparison Section -->
          <div class="flex flex-col gap-3 mt-2">
            <div class="flex items-center gap-2 px-2">
              <div
                class="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
              >
                <TrendingDown size={14} />
              </div>
              <p
                class="font-black text-xs tracking-tight text-slate-700 uppercase"
              >
                {#if item.loading}
                  Tìm giá rẻ hơn...
                {:else}
                  Gợi ý từ các sàn khác
                {/if}
              </p>
            </div>

            {#if item.loading}
              <div class="flex flex-col gap-2 px-1">
                {#each [1, 2] as _}
                  <div
                    class="skeleton h-20 rounded-box w-full opacity-60"
                  ></div>
                {/each}
              </div>
            {:else if item.error}
              <div
                class="bg-slate-50 rounded-box p-4 border border-dashed border-slate-200 text-center"
              >
                <p class="text-[11px] font-bold text-slate-400">
                  Không thể so sánh lúc này. Thử lại sau nhé!
                </p>
              </div>
            {:else if item.products.length === 0}
              <div
                class="bg-slate-50 rounded-box p-4 border border-dashed border-slate-200 text-center"
              >
                <p class="text-[11px] font-bold text-slate-400">
                  Chưa tìm thấy deal nào rẻ hơn cho sản phẩm này.
                </p>
              </div>
            {:else}
              {@const minPrice = Math.min(...item.products.map((p) => p.price))}
              <div class="flex flex-col gap-2 px-1">
                {#each item.products as product, i (product.id)}
                  {@const isCheapest =
                    product.price === minPrice &&
                    i === item.products.findIndex((p) => p.price === minPrice)}
                  <a
                    href={product.aff_link || product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 bg-base-100 rounded-box p-3 border shadow-sm
                      transition-all hover:border-primary/30 hover:shadow-md active:scale-[0.99]
                      {isCheapest
                      ? 'border-success/30 bg-success/5 shadow-success/10'
                      : 'border-base-200'}"
                  >
                    <!-- Thumbnail -->
                    <div class="relative shrink-0">
                      {#if product.image}
                        <img
                          src={product.image}
                          alt={product.name}
                          class="w-14 h-14 object-cover rounded-xl bg-slate-100"
                          loading="lazy"
                        />
                      {:else}
                        <div
                          class="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center"
                        >
                          <ShoppingCart size={16} class="text-slate-300" />
                        </div>
                      {/if}
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight tracking-tight"
                      >
                        {product.name}
                      </p>
                      <div class="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span
                          class="badge badge-xs font-black text-[8px] uppercase tracking-wider h-4 rounded-md {getMerchantColor(
                            product.merchant || product.domain,
                          )} text-white border-none"
                        >
                          {product.merchant || product.domain}
                        </span>
                        {#if isCheapest}
                          <span
                            class="badge badge-xs bg-success text-white font-black text-[8px] border-none h-4 rounded-md uppercase"
                            >Rẻ nhất</span
                          >
                        {/if}
                        {#if product.discount_percentage > 0}
                          <span
                            class="badge badge-xs bg-error text-white font-black text-[8px] border-none h-4 rounded-md"
                          >
                            -{product.discount_percentage}%
                          </span>
                        {/if}
                      </div>
                    </div>

                    <!-- Price -->
                    <div class="text-right shrink-0">
                      <p
                        class="text-sm font-black text-slate-900 tracking-tighter"
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </p>
                      {#if product.original_price > product.price}
                        <p
                          class="text-[9px] text-slate-400 line-through font-bold"
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                          }).format(product.original_price)}
                        </p>
                      {/if}
                    </div>

                    <div class="text-slate-300">
                      <ExternalLink size={12} />
                    </div>
                  </a>
                {/each}
              </div>
            {/if}
          </div>
        </div>

        {#if items.indexOf(item) < items.length - 1}
          <div
            class="divider before:bg-slate-100 after:bg-slate-100 my-2 opacity-50"
          ></div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<!-- ── Snippets ───────────────────────────────────────────────────────────────── -->

{#snippet inputRow()}
  <div class="flex gap-2 w-full">
    <div class="relative flex-1">
      <input
        type="text"
        bind:value={url}
        onkeydown={(e) => e.key === "Enter" && scan()}
        placeholder="Dán link Shopee, Lazada..."
        class="input input-bordered w-full text-sm rounded-field h-12 pl-4 pr-10 focus:border-primary border-2 border-slate-200 transition-all font-medium"
      />
      {#if url}
        <button
          class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle btn-xs hover:bg-slate-100"
          onclick={() => (url = "")}
        >
          <X size={14} class="text-slate-400" />
        </button>
      {/if}
    </div>
    <button
      class="btn btn-outline h-12 w-12 rounded-field border-2 border-slate-200 hover:bg-slate-100 transition-all active:scale-95 p-0"
      onclick={() => fileInput.click()}
      title="Quét mã QR"
    >
      <QrCode size={18} />
    </button>
    <button
      class="btn btn-primary h-12 px-5 rounded-field font-black shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:bg-slate-200"
      onclick={scan}
      disabled={scanning || !url.trim()}
    >
      {#if scanning}
        <span class="loading loading-spinner loading-sm"></span>
      {:else}
        <div class="flex items-center gap-2">
          <Search size={18} />
          <span class="hidden sm:inline">Quét</span>
        </div>
      {/if}
    </button>
  </div>
{/snippet}
