<script lang="ts">
  import store from "$lib/store.svelte";
  import { fly, fade } from "svelte/transition";
  import { CheckCircle2, AlertCircle, XCircle, Info, X } from "lucide-svelte";

  const typeStyles = {
    info: "text-blue-600",
    success: "text-green-600",
    error: "text-red-600",
    warning: "text-yellow-600",
  };

  const icons = {
    info: Info,
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
  };
</script>

<div class="toast toast-bottom toast-center sm:toast-top sm:toast-end z-50 p-4">
  {#each store.toasts as toast (toast.id)}
    <div
      in:fly={{ y: 20, duration: 300 }}
      out:fade={{ duration: 200 }}
      class="card bg-base-100 border border-slate-200/80 shadow-lg shadow-slate-300/20 flex-row items-center p-3 gap-3 w-full max-w-sm"
      role="alert"
    >
      <svelte:component
        this={icons[toast.type]}
        class="w-6 h-6 shrink-0 {typeStyles[toast.type]}"
      />
      <span class="flex-1 font-semibold text-sm text-slate-700"
        >{toast.message}</span
      >
      <button
        class="btn btn-ghost btn-xs btn-circle"
        onclick={() => store.removeToast(toast.id)}
      >
        <X size={16} />
      </button>
    </div>
  {/each}
</div>
