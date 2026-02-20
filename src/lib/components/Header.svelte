<script>
  import { Bell } from "lucide-svelte";
  import store from "$lib/store.svelte";
  import clsx from "clsx";
</script>

<div
  class={clsx(
    "navbar bg-base-100 border-b border-base-300 px-4",
    store.platform === "mobile" ? "pt-8 pb-2" : "py-3",
  )}
>
  <div class="navbar-start">
    {#if store.platform !== "desktop"}
      <div class="flex items-center gap-2">
        <div class="btn btn-primary btn-square btn-sm font-black text-lg">
          D
        </div>
        <span class="text-xl font-black tracking-tighter">Dealy</span>
      </div>
    {/if}
  </div>
  <div class="navbar-end gap-2">
    <div class="indicator">
      <Bell size={20} class="text-base-content/70" />
      <span class="badge badge-error badge-xs indicator-item"></span>
    </div>
    {#if store.platform === "web"}
      <button class="btn btn-primary btn-sm rounded-lg ml-2">Sign In</button>
    {/if}
  </div>
</div>
