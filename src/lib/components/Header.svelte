<script lang="ts">
  import { Bell } from "lucide-svelte";
  import store from "$lib/store.svelte";
  import clsx from "clsx";
  import type { Tab } from "$lib/types";

  // Chỉ 3 tabs — account truy cập qua modal Sign In/Sign Up
  const NAV_ITEMS: { id: Tab; label: string }[] = [
    { id: "home", label: "Scanner" },
    { id: "deals", label: "Deals" },
    { id: "coupons", label: "Voucher" },
  ];
</script>

<header
  class={clsx(
    "bg-base-100 border-b border-base-300 px-4 flex items-center justify-between shrink-0",
    store.platform === "mobile" ? "pt-8 pb-2 min-h-[4.5rem]" : "h-14",
  )}
>
  <!-- Logo -->
  <div class="flex items-center gap-2.5">
    {#if store.platform !== "desktop"}
      <div
        class="w-7 h-7 bg-primary text-primary-content rounded-md flex items-center justify-center font-black text-sm"
      >
        D
      </div>
      <span class="font-black tracking-tighter text-lg">Dealy</span>
    {/if}
  </div>

  <!--
    Horizontal text nav — web only, từ md trở lên.
    Không dùng class btn để giữ kiểu chữ thuần (business-like, no icon).
  -->
  {#if store.platform === "web"}
    <nav class="hidden md:flex items-center gap-6">
      {#each NAV_ITEMS as item}
        {@const active = store.activeTab === item.id}
        <button
          class={clsx(
            "text-sm transition-colors duration-150",
            active
              ? "font-semibold text-base-content"
              : "font-normal text-base-content/45 hover:text-base-content/75",
          )}
          onclick={() => store.setTab(item.id)}
        >
          {item.label}
        </button>
      {/each}
    </nav>
  {/if}

  <!-- Actions -->
  <div class="flex items-center gap-2">
    <div class="indicator">
      <Bell size={18} class="text-base-content/60" />
      <span class="badge badge-error badge-xs indicator-item"></span>
    </div>

    {#if store.platform === "web"}
      {#if store.isLoggedIn}
        <button
          class="btn btn-ghost btn-sm font-medium"
          onclick={() => store.logout()}
        >
          Đăng xuất
        </button>
      {:else}
        <div class="hidden md:flex items-center gap-2 ml-2">
          <button
            class="btn btn-ghost btn-sm font-medium"
            onclick={() => store.openAuth("signin")}
          >
            Đăng nhập
          </button>
          <button
            class="btn btn-primary btn-sm font-semibold"
            onclick={() => store.openAuth("signup")}
          >
            Đăng ký miễn phí
          </button>
        </div>
        <!-- Mobile web: chỉ 1 nút -->
        <button
          class="btn btn-primary btn-sm font-semibold md:hidden"
          onclick={() => store.openAuth("signin")}
        >
          Đăng nhập
        </button>
      {/if}
    {/if}
  </div>
</header>
