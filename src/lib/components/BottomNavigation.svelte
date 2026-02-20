<script>
  import { LayoutGrid, Heart, ShoppingCart } from "lucide-svelte";
  import store from "$lib/store.svelte";
</script>

{#if store.platform === "mobile"}
  <div
    class="btm-nav btm-nav-sm bg-base-100 border-t border-base-300 h-16 rounded-t-3xl"
  >
    <button class="active text-primary">
      <LayoutGrid size={18} />
      <span class="btm-nav-label text-[9px]">Explore</span>
    </button>
    <button>
      <Heart size={18} />
      <span class="btm-nav-label text-[9px]">Saved</span>
    </button>
    <button>
      <ShoppingCart size={18} />
      <span class="btm-nav-label text-[9px]">Cart</span>
    </button>
  </div>
{/if}
