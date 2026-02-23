<script lang="ts">
  import "../app.css";
  import AppNav from "$lib/components/AppNav.svelte";
  import AppFooter from "$lib/components/AppFooter.svelte";
  import QrScannerModal from "$lib/components/QrScannerModal.svelte";

  let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-base-200">
  <AppNav />

  {@render children()}

  <AppFooter />
</div>
