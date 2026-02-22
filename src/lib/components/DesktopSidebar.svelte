<script lang="ts">
  import { Home, Zap, Tag, CircleUser } from "lucide-svelte";
  import store from "$lib/store.svelte";
  import clsx from "clsx";
  import type { Tab } from "$lib/types";

  const NAV_ITEMS: { id: Tab; icon: typeof Home; label: string }[] = [
    { id: "home", icon: Home, label: "Scanner" },
    { id: "deals", icon: Zap, label: "Deals" },
    { id: "coupons", icon: Tag, label: "Voucher" },
    { id: "account", icon: CircleUser, label: "Tài khoản" },
  ];
</script>

{#if store.platform === "desktop"}
  <aside class="w-60 bg-base-200 border-r border-base-300 flex flex-col p-4 shrink-0">
    <!-- Branding -->
    <div class="flex items-center gap-3 px-2 py-6">
      <div
        class="w-8 h-8 bg-primary text-primary-content rounded-lg flex items-center justify-center font-black text-sm"
      >
        D
      </div>
      <span class="text-lg font-black tracking-tighter">Dealy Pro</span>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col gap-1">
      {#each NAV_ITEMS as item}
        {@const active = store.activeTab === item.id}
        <button
          class={clsx(
            "flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-colors duration-150 text-left",
            active
              ? "bg-primary text-primary-content font-black"
              : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content font-medium",
          )}
          onclick={() => store.setTab(item.id)}
        >
          <svelte:component this={item.icon} size={18} strokeWidth={active ? 2.5 : 1.8} />
          {item.label}
        </button>
      {/each}
    </nav>

    <!-- Status indicator -->
    <div class="mt-auto card bg-neutral text-neutral-content p-4">
      <div class="flex items-center gap-2 text-[10px] font-bold text-success uppercase">
        <span class="w-2 h-2 bg-success rounded-full animate-pulse"></span>
        Desktop Node Active
      </div>
    </div>
  </aside>
{/if}
