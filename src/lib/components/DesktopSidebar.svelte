<script lang="ts">
  import { Heart, Zap, TrendingUp, LayoutGrid } from "lucide-svelte";
  import store from "$lib/store.svelte";

  const menu = {
    home: {
      icon: LayoutGrid,
      label: "Dashboard",
      href: "/",
    },
    deals: {
      icon: Zap,
      label: "Hot Deals",
      href: "/",
    },
    history: {
      icon: TrendingUp,
      label: "Price History",
      href: "/",
    },
    favs: {
      icon: Heart,
      label: "Favorites",
      href: "/",
    },
  };
</script>

{#if store.platform === "desktop"}
  <aside class="w-60 bg-base-200 border-r border-base-300 flex flex-col p-4">
    <div class="flex items-center gap-3 px-2 py-6">
      <div
        class="w-8 h-8 bg-primary text-primary-content rounded-lg flex items-center justify-center font-black"
      >
        D
      </div>
      <span class="text-lg font-bold">Dealy Pro</span>
    </div>
    <ul class="menu w-full gap-1 p-0">
      {#each Object.entries(menu) as [_, item]}
        <li>
          <a
            href={item.href}
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-neutral-content/5"
          >
            <svelte:component this={item.icon} size={18} />
            {item.label}
          </a>
        </li>
      {/each}
    </ul>
    <div class="mt-auto card bg-neutral text-neutral-content p-4">
      <div
        class="flex items-center gap-2 text-[10px] font-bold text-success uppercase"
      >
        <span class="w-2 h-2 bg-success rounded-full animate-pulse"></span> Desktop
        Node Active
      </div>
    </div>
  </aside>
{/if}
