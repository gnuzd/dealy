<script>
  import { onMount } from "svelte";

  import { generateAffiliateLink } from "$lib/constants";
  import store from "$lib/store.svelte";

  let message = $state("");

  const startRedirect = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const rawUrl = urlParams.get("deeplink");

    if (!rawUrl) {
      store.showToast({
        message: "Không tìm thấy URL để chuyển hướng.",
        type: "error",
      });

      message = "Không tìm thấy link.";

      return;
    }

    window.location.replace(rawUrl);
  };

  onMount(() => {
    setTimeout(startRedirect, 50);
  });
</script>

<div class="flex-1 bg-white flex items-center justify-center">
  {#if message}
    <p class="text-2xl font-medium">{message}</p>
  {:else}
    <div
      class="w-10 h-10 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"
    ></div>
  {/if}
</div>
