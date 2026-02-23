<script lang="ts">
  import ScannerView from "$lib/components/ScannerView.svelte";
  import DealsView from "$lib/components/DealsView.svelte";
  import VoucherView from "$lib/components/VoucherView.svelte";
  import QrScannerModal from "$lib/components/QrScannerModal.svelte";
  import store from "$lib/store.svelte";
  import { generateAffiliateLink } from "$lib/constants";

  type Tab = "scanner" | "deals" | "voucher";

  // ── Tab ──────────────────────────────────────────────────────────────────
  // let activeTab = $state<Tab>("scanner");

  // ── Scanner state — persists when switching tabs ──────────────────────────
  let url = $state("");
  let generatedLink = $state("");
  let error = $state("");
  let scannerOpen = $state(false);

  // ── Deals state — loaded once on first visit, cached ─────────────────────
  let dealsLoaded = $state(false);
  let dealsLoading = $state(false);

  // ── Voucher state — loaded once on first visit, cached ───────────────────
  let vouchersLoaded = $state(false);
  let vouchersLoading = $state(false);

  // Load per-tab data only once when tab is first visited
  $effect(() => {
    if (store.activeTab === "deals" && !dealsLoaded && !dealsLoading) {
      loadDeals();
    }
    if (store.activeTab === "voucher" && !vouchersLoaded && !vouchersLoading) {
      loadVouchers();
    }
  });

  async function loadDeals() {
    dealsLoading = true;
    // TODO: fetch from get-deals worker when available
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    dealsLoaded = true;
    dealsLoading = false;
  }

  async function loadVouchers() {
    vouchersLoading = true;
    // TODO: fetch from get-deals worker when available
    await new Promise((r) => setTimeout(r, 600));
    vouchersLoaded = true;
    vouchersLoading = false;
  }

  // ── Scanner logic ─────────────────────────────────────────────────────────
  function isValidUrl(value: string): boolean {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }

  function generate() {
    error = "";
    generatedLink = "";
    const trimmed = url.trim();
    if (!trimmed) {
      error = "Vui lòng nhập URL sản phẩm.";
      return;
    }
    if (!isValidUrl(trimmed)) {
      error = "URL không hợp lệ. Ví dụ: https://shopee.vn/...";
      return;
    }
    generatedLink = generateAffiliateLink(trimmed);
  }

  function handleScanned(scannedUrl: string) {
    url = scannedUrl;
    // Switch to scanner tab if not already there
    store.setTab("home");
    generate();
  }
</script>

<main class="flex-1 flex flex-col overflow-y-auto">
  <!-- Views are kept in DOM but hidden via display:none for instant tab switching.
         State is never destroyed — scan result, deals, vouchers all persist. -->

  <div class="flex-1 flex flex-col" class:hidden={store.activeTab !== "home"}>
    <ScannerView
      bind:url
      {error}
      {generatedLink}
      ongenerate={generate}
      onscanrequest={() => (scannerOpen = true)}
      onclear={() => (url = "")}
    />
  </div>

  <div class="flex-1 flex flex-col" class:hidden={store.activeTab !== "deals"}>
    <DealsView loaded={dealsLoaded} />
  </div>

  <div
    class="flex-1 flex flex-col"
    class:hidden={store.activeTab !== "voucher"}
  >
    <VoucherView loaded={vouchersLoaded} />
  </div>
</main>

<QrScannerModal bind:open={scannerOpen} onscanned={handleScanned} />
