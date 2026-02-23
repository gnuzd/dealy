<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";

  import AppNav from "$lib/components/AppNav.svelte";
  import AppFooter from "$lib/components/AppFooter.svelte";
  import QrScannerModal from "$lib/components/QrScannerModal.svelte";
  import BottomNavigation from "$lib/components/BottomNavigation.svelte";
  import store from "$lib/store.svelte";
  import Toaster from "$lib/components/Toaster.svelte";

  let { children } = $props();

  onMount(() => {
    if (typeof window !== "undefined" && window.__TAURI_INTERNALS__) {
      store.setPlatform("desktop");
    }
  });
</script>

<div class="min-h-screen flex flex-col bg-base-200">
  <AppNav />

  {@render children()}

  <AppFooter />
  <BottomNavigation />
</div>

<Toaster />
