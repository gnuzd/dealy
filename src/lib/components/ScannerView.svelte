<script lang="ts">
  import {
    QrCode,
    Copy,
    CircleCheck,
    ExternalLink,
    Share2,
    Globe,
    Link2,
    X,
  } from "lucide-svelte";

  let {
    url = $bindable(),
    error,
    generatedLink,
    ongenerate,
    onscanrequest,
    onclear,
  }: {
    url: string;
    error: string;
    generatedLink: string;
    ongenerate: () => void;
    onscanrequest: () => void;
    onclear: () => void;
  } = $props();

  let copied = $state(false);
  let imgError = $state(false);

  $effect(() => {
    if (generatedLink) imgError = false;
  });

  function getHostname(u: string): string {
    try {
      return new URL(u).hostname;
    } catch {
      return "";
    }
  }

  function getPlatformName(h: string): string {
    if (h.includes("shopee")) return "Shopee";
    if (h.includes("lazada")) return "Lazada";
    if (h.includes("tiki")) return "Tiki";
    if (h.includes("sendo")) return "Sendo";
    if (h.includes("thegioididong") || h.includes("tgdd"))
      return "Thế Giới Di Động";
    if (h.includes("cellphones")) return "CellphoneS";
    if (h.includes("dienmayxanh")) return "Điện Máy Xanh";
    return h;
  }

  let hostname = $derived(generatedLink ? getHostname(url) : "");
  let platform = $derived(getPlatformName(hostname));
  let faviconUrl = $derived(
    hostname
      ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`
      : "",
  );
  let linkDomain = $derived(
    generatedLink.replace("https://", "").split("/")[0],
  );
  let linkPath = $derived(
    "/" + generatedLink.replace("https://", "").split("/").slice(1).join("/"),
  );

  async function copyLink() {
    await navigator.clipboard.writeText(generatedLink);
    copied = true;
    setTimeout(() => (copied = false), 2000);
  }

  async function openLink() {
    try {
      const { openUrl } = await import("@tauri-apps/plugin-opener");
      await openUrl(generatedLink);
    } catch {
      window.open(generatedLink, "_blank");
    }
  }

  async function shareLink() {
    try {
      await navigator.share({ url: generatedLink });
    } catch {
      await copyLink();
    }
  }

  const platforms = [
    { name: "Shopee", cls: "text-orange-500 border-orange-200 bg-orange-50" },
    { name: "Lazada", cls: "text-blue-600  border-blue-200  bg-blue-50" },
    { name: "Tiki", cls: "text-cyan-600  border-cyan-200  bg-cyan-50" },
    { name: "Sendo", cls: "text-red-500   border-red-200   bg-red-50" },
  ];

  // state indicator: are we showing the result or the idle hero?
  let hasResult = $derived(!!generatedLink);
</script>

<!--
  Two visual states:
  • idle  (no result) → large top padding (~1/3 screen), show hero + input
  • result (has link) → small top padding, hero hidden, input + result card
-->
<div
  class="flex-1 flex flex-col items-center px-4 pb-12 overflow-y-auto transition-all duration-300
    {hasResult ? 'pt-6' : 'pt-[20vh]'}"
>
  <!-- ── STATE A: Hero (idle only) ─────────────────────────────────────── -->
  {#if !hasResult}
    <div class="flex flex-col items-center mb-6">
      <div
        class="w-16 h-16 bg-base-content rounded-2xl flex items-center justify-center mb-5 shadow-sm"
      >
        <span class="text-base-100 font-black text-3xl leading-none select-none"
          >D</span
        >
      </div>
      <h1 class="text-3xl font-bold text-base-content text-center mb-2">
        Săn Deal Thông Minh
      </h1>
      <p
        class="text-base-content/50 text-sm text-center max-w-xs leading-relaxed"
      >
        Dán link sản phẩm từ Shopee, Lazada... để<br />tạo link affiliate &amp;
        so sánh giá ngay.
      </p>
    </div>
  {/if}

  <!-- ── INPUT CARD (always visible) ───────────────────────────────────── -->
  <div
    class="w-full max-w-xl bg-base-100 rounded-2xl shadow-lg border border-base-content/5 px-4 pt-3.5 pb-3"
  >
    <div class="flex items-center gap-1">
      <input
        class="input input-ghost flex-1 text-sm h-9 px-1 bg-transparent"
        placeholder="Dán link Shopee, Lazada..."
        bind:value={url}
        onkeydown={(e) => e.key === "Enter" && ongenerate()}
      />
      <button
        class="btn btn-ghost btn-sm btn-square text-base-content/40 hover:text-base-content"
        onclick={onscanrequest}
        aria-label="Quét QR"
      >
        <QrCode size={17} />
      </button>
      <button
        class="btn btn-ghost btn-sm text-base-content/50 hover:text-base-content px-3"
        onclick={ongenerate}
      >
        Quét
      </button>
    </div>

    {#if !hasResult}
      <!-- Platform badges — only shown in idle state -->
      <div class="flex items-center gap-2 flex-wrap mt-2.5">
        <span
          class="text-[10px] text-base-content/40 font-semibold uppercase tracking-widest"
          >Hỗ trợ:</span
        >
        {#each platforms as p}
          <span class="badge badge-sm border font-medium {p.cls}">{p.name}</span
          >
        {/each}
      </div>
    {/if}
  </div>

  {#if error}
    <p class="text-error text-xs mt-3">{error}</p>
  {/if}

  <!-- ── STATE B: Result card (after scan) ─────────────────────────────── -->
  {#if hasResult}
    <div
      class="w-full max-w-xl mt-3 bg-base-100 rounded-2xl border border-base-content/5 shadow-md overflow-hidden"
    >
      <!-- Header: status + platform + clear -->
      <div
        class="px-4 py-2.5 border-b border-base-content/5 flex items-center gap-2"
      >
        <CircleCheck size={13} class="text-success flex-shrink-0" />
        <span class="text-xs font-medium text-base-content/65"
          >Affiliate link đã sẵn sàng</span
        >
        <div class="flex-1"></div>
        {#if !imgError && hostname}
          <img
            src={faviconUrl}
            alt={platform}
            width="13"
            height="13"
            class="flex-shrink-0"
            onerror={() => (imgError = true)}
          />
        {:else}
          <Globe size={12} class="text-base-content/35 flex-shrink-0" />
        {/if}
        <span class="text-xs text-base-content/45 mr-1">{platform}</span>
        <button
          class="btn btn-ghost btn-xs btn-circle text-base-content/35 hover:text-base-content"
          onclick={onclear}
          aria-label="Tạo link mới"
        >
          <X size={12} />
        </button>
      </div>

      <!-- Source URL -->
      <div class="px-4 py-2 border-b border-base-content/5">
        <p class="text-base-content/40 text-xs font-mono truncate">{url}</p>
      </div>

      <!-- Affiliate link -->
      <div
        class="px-4 py-2.5 border-b border-base-content/5 flex items-center gap-2"
      >
        <Link2 size={11} class="text-primary flex-shrink-0" />
        <div class="min-w-0 flex-1">
          <span class="text-primary text-xs font-mono font-semibold"
            >{linkDomain}</span
          >
          <p class="text-base-content/30 text-xs font-mono truncate">
            {linkPath}
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-4 py-3 flex gap-2">
        <button class="btn btn-primary btn-sm flex-1" onclick={copyLink}>
          {#if copied}
            <CircleCheck size={13} /> Đã sao chép
          {:else}
            <Copy size={13} /> Sao chép link
          {/if}
        </button>
        <button
          class="btn btn-ghost btn-sm border border-base-content/10"
          onclick={shareLink}
        >
          <Share2 size={13} /> Chia sẻ
        </button>
        <button
          class="btn btn-ghost btn-sm border border-base-content/10"
          onclick={openLink}
        >
          <ExternalLink size={13} /> Mở link
        </button>
      </div>
    </div>
  {/if}
</div>
