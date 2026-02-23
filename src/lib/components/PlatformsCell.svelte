<script lang="ts">
  const { pubId }: { pubId: string } = $props();

  const platforms = [
    { name: 'Shopee',           color: 'bg-primary' },
    { name: 'Lazada',           color: 'bg-secondary' },
    { name: 'Tiki',             color: 'bg-accent' },
    { name: 'Sendo',            color: 'bg-primary/60' },
    { name: 'Thế Giới Di Động', color: 'bg-secondary/60' },
  ];
</script>

<div class="col-span-12 lg:col-span-5 lg:row-span-2 bg-base-200 rounded-box p-6 border border-base-content/5 flex flex-col gap-4">
  <p class="text-base-content font-bold text-sm">Hỗ trợ sàn thương mại</p>

  {#each platforms as p}
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-badge {p.color}"></div>
        <span class="text-base-content/70 text-xs">{p.name}</span>
      </div>
      <div class="badge badge-sm badge-ghost text-base-content/50">Hỗ trợ</div>
    </div>
  {/each}

  <div class="divider my-0 border-base-content/5"></div>

  <div class="flex flex-col gap-1">
    <p class="text-base-content/50 text-xs">Powered by</p>
    <p class="text-base-content font-bold text-sm">Accesstrade Network</p>
    <p class="text-base-content/50 text-xs">Pub ID: {pubId.slice(0, 8)}…</p>
  </div>
</div>
