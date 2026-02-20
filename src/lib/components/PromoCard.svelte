<script lang="ts">
  import { Zap } from "lucide-svelte";
</script>

<div
  class="card bg-primary text-primary-content shadow-xl mb-6 overflow-hidden relative group"
>
  <div class="card-body p-6 z-10">
    <h2 class="card-title text-2xl font-black mb-0">Up to -50%</h2>
    <p class="text-xs opacity-80 mb-4">New tech deals just arrived.</p>
    <div class="card-actions">
      <button class="btn btn-xs btn-secondary">Explore</button>
    </div>
  </div>

  <Zap size={150} class="absolute -right-6 -bottom-6 opacity-10" />
</div>
