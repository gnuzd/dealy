<script lang="ts">
  import { Home, Zap, Tag, CircleUser } from "lucide-svelte";
  import store from "$lib/store.svelte";
  import clsx from "clsx";
  import type { Tab } from "$lib/types";

  const tabs: { id: Tab; label: string; icon: typeof Home }[] = [
    { id: "home", label: "Trang chủ", icon: Home },
    { id: "deals", label: "Deals", icon: Zap },
    { id: "voucher", label: "Voucher", icon: Tag },
    { id: "profile", label: "Tài khoản", icon: CircleUser },
  ];
</script>

<!--
  Show khi:
  - platform === "mobile" (native mobile app): luôn hiện
  - platform === "web": chỉ hiện trên màn hình nhỏ (md:hidden ẩn từ tablet trở lên)
  Ẩn hoàn toàn khi platform === "desktop" (Tauri)
-->
{#if store.platform !== "desktop"}
  <nav
    class={clsx(
      "bg-base-100 border-t border-base-300 flex items-stretch shrink-0",
      store.platform === "mobile" ? "h-20 pb-4" : "h-16",
      store.platform === "web" && "md:hidden",
    )}
  >
    {#each tabs as tab}
      {@const active = store.activeTab === tab.id}
      <button
        class={clsx(
          "flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150",
          active
            ? "text-primary"
            : "text-base-content/35 hover:text-base-content/60",
        )}
        onclick={() => store.setTab(tab.id)}
      >
        <svelte:component
          this={tab.icon}
          size={20}
          strokeWidth={active ? 2.5 : 1.8}
        />
        <span
          class={clsx(
            "text-[9px] tracking-tight transition-all",
            active ? "font-black" : "font-medium",
          )}
        >
          {tab.label}
        </span>
      </button>
    {/each}
  </nav>
{/if}
