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
  } from "lucide-svelte";
  import { PUBLIC_COMPARE_URL } from "$env/static/public";
  import { detectMerchant, generateAffiliateLink, AFFILIATE_PUB_ID } from "$lib/constants";

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

  // ─── Scan → Compare ──────────────────────────────────────────────────────────

  async function scan() {
    const trimmed = url.trim();
    if (!trimmed || scanning) return;

    inputError = null;
    scanning = true;

    const merchant = detectMerchant(trimmed);
    if (!merchant) {
      inputError = "Link không được hỗ trợ. Thử link từ Shopee, Lazada, Tiki hoặc Sendo.";
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
      updateItem(itemId, {
        keyword: data.keyword ?? "",
        products: data.products ?? [],
        loading: false,
      });
    } catch {
      updateItem(itemId, { loading: false, error: true });
    }
  }

  function removeItem(id: string) {
    items = items.filter((i) => i.id !== id);
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link);
    copiedLink = link;
    setTimeout(() => (copiedLink = null), 2500);
  }

  // ─── QR ──────────────────────────────────────────────────────────────────────

  async function handleQRFile(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    if (!("BarcodeDetector" in window)) {
      inputError = "Trình duyệt chưa hỗ trợ quét QR. Vui lòng dùng Chrome hoặc Edge.";
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

{#if items.length === 0}
  <!-- ── Hero ── -->
  <div class="flex-1 flex flex-col items-center justify-center gap-6 px-2">
    <div class="btn btn-primary btn-square pointer-events-none w-20 h-20 text-4xl font-black">
      D
    </div>

    <div class="text-center">
      <h1 class="font-black text-2xl tracking-tighter">So sánh giá thông minh</h1>
      <p class="text-sm text-slate-500 mt-1">
        Dán link sản phẩm — tìm ngay giá tốt nhất trên tất cả sàn
      </p>
    </div>

    <div
      class="card bg-base-100 shadow-xl shadow-slate-200 border border-base-200 w-full max-w-lg"
    >
      <div class="card-body p-4 gap-3">
        {@render inputRow()}

        {#if inputError}
          <div
            in:fade={{ duration: 150 }}
            class="flex items-center gap-1.5 text-error text-xs font-medium"
          >
            <AlertCircle size={13} />
            {inputError}
          </div>
        {/if}

        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Hỗ trợ:
          </span>
          {#each PLATFORMS as p}
            <span class="badge badge-sm font-semibold text-[10px] {p.cls}">{p.name}</span>
          {/each}
        </div>
      </div>
    </div>
  </div>

{:else}
  <!-- ── Results ── -->
  <div class="flex flex-col gap-5">
    <!-- Compact input -->
    <div class="flex flex-col gap-2">
      {@render inputRow()}
      {#if inputError}
        <div
          in:fade={{ duration: 150 }}
          class="flex items-center gap-1.5 text-error text-xs font-medium"
        >
          <AlertCircle size={13} />
          {inputError}
        </div>
      {/if}
    </div>

    <!-- Search result items -->
    {#each items as item (item.id)}
      <div in:fly={{ y: 10, duration: 240 }} class="flex flex-col gap-3">
        <!-- Deeplink card — shown INSTANTLY, client-side generated -->
        <div
          class="card bg-base-100 shadow-xl shadow-slate-200 rounded-3xl border border-base-200 overflow-hidden"
        >
          <div class="h-1.5 w-full {item.bgClass}"></div>
          <div class="p-5">
            <div class="flex items-center justify-between mb-4">
              <span class="badge badge-sm font-black uppercase tracking-widest">
                {item.merchant}
              </span>
              <button
                class="btn btn-ghost btn-xs btn-circle"
                onclick={() => removeItem(item.id)}
              >
                <X size={13} />
              </button>
            </div>

            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Link mua hàng — hoa hồng ghi nhận khi mua
            </p>
            <div class="bg-slate-50 rounded-xl p-2.5 mb-4 border border-slate-100">
              <p class="text-[11px] font-mono text-slate-500 truncate">{item.affiliateLink}</p>
            </div>

            <div class="flex gap-2">
              <button
                class="btn btn-sm flex-1 border-slate-200 font-semibold"
                onclick={() => copyLink(item.affiliateLink)}
              >
                {#if copiedLink === item.affiliateLink}
                  <CheckCircle2 size={14} class="text-success" /> Đã copy
                {:else}
                  <Copy size={14} /> Copy link
                {/if}
              </button>
              <a
                href={item.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary btn-sm flex-1 font-black"
              >
                <ShoppingCart size={14} /> Mua ngay
              </a>
            </div>
          </div>
        </div>

        <!-- Comparison header -->
        <div class="flex items-center gap-2 px-1">
          <TrendingDown size={14} class="text-primary shrink-0" />
          <p class="font-black text-sm tracking-tighter text-slate-700 flex-1 truncate">
            {#if item.loading}
              <span class="text-slate-400 font-normal">Đang tìm sản phẩm tương tự...</span>
            {:else if item.keyword}
              So sánh giá · {item.keyword}
            {:else}
              So sánh giá
            {/if}
          </p>
        </div>

        {#if item.loading}
          <div class="flex flex-col gap-2">
            {#each [1, 2, 3, 4] as _}
              <div class="skeleton h-16 rounded-2xl w-full"></div>
            {/each}
          </div>

        {:else if item.error}
          <p class="text-center text-xs text-slate-400 py-2">
            Không tải được kết quả. Thử lại sau.
          </p>

        {:else if item.products.length === 0}
          <p class="text-center text-xs text-slate-400 py-2">
            Không tìm thấy sản phẩm tương tự.
          </p>

        {:else}
          {@const minPrice = Math.min(...item.products.map((p) => p.price))}
          <div class="flex flex-col gap-2">
            {#each item.products as product, i (product.id)}
              {@const isCheapest =
                product.price === minPrice &&
                i === item.products.findIndex((p) => p.price === minPrice)}
              {@const hasDiscount = product.original_price > product.price}
              <a
                href={product.aff_link || product.link}
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 bg-base-100 rounded-2xl px-3 py-3 border shadow-sm
                  transition-colors hover:border-primary/30
                  {isCheapest ? 'border-success/30 bg-success/5' : 'border-base-200'}"
              >
                <!-- Thumbnail -->
                {#if product.image}
                  <img
                    src={product.image}
                    alt={product.name}
                    class="w-12 h-12 object-cover rounded-xl shrink-0 bg-slate-100"
                    loading="lazy"
                  />
                {:else}
                  <div class="w-12 h-12 rounded-xl bg-slate-100 shrink-0"></div>
                {/if}

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                    {product.name}
                  </p>
                  <div class="flex items-center gap-1 mt-1 flex-wrap">
                    <span class="badge badge-xs font-semibold capitalize">
                      {product.merchant || product.domain}
                    </span>
                    {#if isCheapest}
                      <span
                        class="badge badge-xs bg-success/15 text-success font-black border-success/20"
                      >
                        Rẻ nhất
                      </span>
                    {/if}
                    {#if product.discount_percentage > 0}
                      <span
                        class="badge badge-xs bg-error/10 text-error font-bold border-error/20"
                      >
                        -{product.discount_percentage}%
                      </span>
                    {/if}
                  </div>
                </div>

                <!-- Price -->
                <div class="text-right shrink-0">
                  <p class="text-sm font-black text-slate-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(product.price)}
                  </p>
                  {#if hasDiscount}
                    <p class="text-[10px] text-slate-400 line-through">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      }).format(product.original_price)}
                    </p>
                  {/if}
                </div>

                <ExternalLink size={12} class="text-slate-300 shrink-0" />
              </a>
            {/each}
          </div>
        {/if}
      </div>

      {#if items.indexOf(item) < items.length - 1}
        <div class="divider my-0"></div>
      {/if}
    {/each}
  </div>
{/if}

<!-- ── Snippets ───────────────────────────────────────────────────────────────── -->

{#snippet inputRow()}
  <div class="flex gap-2">
    <input
      type="text"
      bind:value={url}
      onkeydown={(e) => e.key === "Enter" && scan()}
      placeholder="https://shopee.vn/san-pham..."
      class="input input-bordered flex-1 text-sm"
    />
    <button
      class="btn btn-outline btn-square"
      onclick={() => fileInput.click()}
      title="Quét mã QR"
    >
      <QrCode size={18} />
    </button>
    <button
      class="btn btn-primary btn-square"
      onclick={scan}
      disabled={scanning || !url.trim()}
    >
      {#if scanning}
        <span class="loading loading-spinner loading-sm"></span>
      {:else}
        <Search size={18} />
      {/if}
    </button>
  </div>
{/snippet}
