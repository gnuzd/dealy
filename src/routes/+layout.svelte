<script lang="ts">
  import { onMount } from "svelte";
  import "./layout.css";
  import store from "$lib/store.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import DesktopSidebar from "$lib/components/DesktopSidebar.svelte";
  import Header from "$lib/components/Header.svelte";
  import BottomNavigation from "$lib/components/BottomNavigation.svelte";
  import AuthModal from "$lib/components/AuthModal.svelte";

  const { children } = $props();

  onMount(() => {
    if (typeof window !== "undefined" && window.__TAURI_INTERNALS__) {
      store.setPlatform("desktop");
    }
  });
</script>

<svelte:head>
  <link rel="icon" href="/" />
  <title>Dealy App</title>
</svelte:head>

<AuthModal />

<div class="bg-base-100 font-sans transition-colors duration-300">
  <div class="flex h-screen w-full overflow-hidden">
    <DesktopSidebar />

    <div class="flex-1 flex flex-col h-full overflow-hidden">
      <Header />

      <!--
        main: scroll container — flex-1 min-h-0 cho phép overflow-y-auto hoạt động đúng
        inner div: min-h-full đảm bảo luôn ≥ viewport height → footer luôn ở dưới cùng
      -->
      <main class="flex-1 min-h-0 overflow-y-auto bg-base-200/30">
        <div class="min-h-full flex flex-col p-4 md:p-6">
          {@render children()}
          <Footer />
        </div>
      </main>
      <BottomNavigation />
    </div>
  </div>
</div>
