<script lang="ts">
  import store from "$lib/store.svelte";
  import type { Tab } from "$lib/types";
  import Bell from "@lucide/svelte/icons/bell";

  const tabs: { key: Tab; label: string }[] = [
    { key: "home", label: "Scanner" },
    { key: "deals", label: "Deals" },
    { key: "voucher", label: "Voucher" },
  ];
</script>

<header class="relative border-b border-base-content/8 bg-base-100 px-5 z-10">
  <div class="container mx-auto flex items-center justify-between h-14">
    <!-- Left: logo -->
    <button
      class="flex items-center gap-2 shrink-0"
      onclick={() => store.setTab("home")}
    >
      <div
        class="w-7 h-7 bg-base-content rounded-lg flex items-center justify-center"
      >
        <span class="text-base-100 font-black text-xs leading-none">D</span>
      </div>
      <span class="font-bold text-base-content text-sm">Dealy</span>
    </button>

    <!-- Center: tab nav (absolute to truly center regardless of side widths) -->
    <nav class="absolute left-1/2 -translate-x-1/2 flex items-center gap-0.5">
      {#each tabs as tab}
        <button
          onclick={() => store.setTab(tab.key)}
          class="px-4 py-1.5 text-sm rounded-btn transition-colors
          {store.activeTab === tab.key
            ? 'text-base-content font-semibold'
            : 'text-base-content/45 hover:text-base-content/70'}"
        >
          {tab.label}
        </button>
      {/each}
    </nav>

    <!-- Right: actions -->
    <div class="flex items-center gap-1 shrink-0">
      <button class="btn btn-ghost btn-sm btn-circle" aria-label="Thông báo">
        <Bell size={15} />
      </button>
      <button class="btn btn-ghost btn-sm">Đăng nhập</button>
      <button class="btn btn-neutral btn-sm">Đăng ký miễn phí</button>
    </div>
  </div>
</header>
