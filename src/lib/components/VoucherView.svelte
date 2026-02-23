<script lang="ts">
  const { loaded = false }: { loaded?: boolean } = $props();
</script>

<div class="flex-1 flex flex-col items-center justify-center px-4 py-16 gap-4">
  {#if !loaded}
    <div class="flex flex-col items-center gap-3">
      <span class="loading loading-spinner loading-md text-base-content/30"></span>
      <p class="text-base-content/40 text-sm">Đang tải voucher...</p>
    </div>
  {:else}
    <div class="text-center">
      <p class="text-base-content font-semibold mb-1">Chưa có voucher nào</p>
      <p class="text-base-content/45 text-sm">Quay lại sau để xem mã giảm giá mới nhất.</p>
    </div>
  {/if}
</div>
