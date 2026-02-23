<script lang="ts">
  import { onDestroy } from "svelte";
  import QrScanner from "qr-scanner";
  import { Upload, X, ScanLine } from "lucide-svelte";

  let {
    open = $bindable(false),
    onscanned,
  }: {
    open: boolean;
    onscanned: (url: string) => void;
  } = $props();

  let activeTab = $state<"camera" | "file">("camera");
  let cameraError = $state("");
  let fileError = $state("");
  let videoEl = $state<HTMLVideoElement | null>(null);
  // Plain let — NOT $state. QrScanner mutates itself internally;
  // wrapping in $state causes infinite effect re-runs.
  let scanner: QrScanner | null = null;

  function close() {
    open = false;
  }

  function handleScanned(url: string) {
    onscanned(url);
    close();
  }

  async function startCamera(el: HTMLVideoElement) {
    cameraError = "";
    try {
      scanner = new QrScanner(el, (result) => handleScanned(result.data), {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      });
      await scanner.start();
    } catch {
      cameraError =
        "Không thể truy cập camera. Vui lòng cho phép quyền camera hoặc thử upload ảnh.";
    }
  }

  function stopCamera() {
    scanner?.destroy();
    scanner = null;
  }

  async function handleFile(e: Event) {
    fileError = "";
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      handleScanned(result.data);
    } catch {
      fileError = "Không tìm thấy QR code trong ảnh. Hãy thử ảnh khác.";
    }
    input.value = "";
  }

  // Only tracks: open, activeTab, videoEl — not scanner
  $effect(() => {
    if (open && activeTab === "camera" && videoEl) {
      startCamera(videoEl);
    } else {
      stopCamera();
    }
    return () => stopCamera();
  });

  onDestroy(() => stopCamera());
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="modal modal-open"
    onclick={(e) => e.target === e.currentTarget && close()}
  >
    <div class="modal-box rounded-box max-w-md w-full flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <h3 class="font-bold text-lg text-base-content flex items-center gap-2">
          <ScanLine size={20} class="text-primary" />
          Quét QR Code
        </h3>
        <button class="btn btn-ghost btn-sm" onclick={close}>
          <X size={16} />
        </button>
      </div>

      <div role="tablist" class="tabs tabs-boxed bg-base-200">
        <button
          role="tab"
          class="tab {activeTab === 'camera' ? 'tab-active' : ''}"
          onclick={() => {
            activeTab = "camera";
            cameraError = "";
            fileError = "";
          }}
        >
          <ScanLine size={14} class="mr-1" />
          Camera
        </button>
        <button
          role="tab"
          class="tab {activeTab === 'file' ? 'tab-active' : ''}"
          onclick={() => {
            activeTab = "file";
            cameraError = "";
            fileError = "";
          }}
        >
          <Upload size={14} class="mr-1" />
          Upload ảnh
        </button>
      </div>

      {#if activeTab === "camera"}
        <div class="flex flex-col gap-3">
          <div
            class="rounded-box overflow-hidden bg-base-300 aspect-square flex items-center justify-center"
          >
            <!-- svelte-ignore a11y_media_has_caption -->
            <video bind:this={videoEl} class="w-full h-full object-cover"
            ></video>
          </div>
          {#if cameraError}
            <p class="text-error text-xs">{cameraError}</p>
          {:else}
            <p class="text-base-content/50 text-xs text-center">
              Hướng camera vào QR code để quét tự động
            </p>
          {/if}
        </div>
      {:else}
        <div class="flex flex-col gap-3">
          <label
            class="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-base-content/20 rounded-box p-8 cursor-pointer hover:border-primary/40 transition-colors"
          >
            <Upload size={32} class="text-base-content/40" />
            <span class="text-base-content/60 text-sm text-center"
              >Chọn ảnh chứa QR code</span
            >
            <input
              type="file"
              accept="image/*"
              class="hidden"
              onchange={handleFile}
            />
          </label>
          {#if fileError}
            <p class="text-error text-xs">{fileError}</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
