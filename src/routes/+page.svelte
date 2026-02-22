<script lang="ts">
  import { fade } from "svelte/transition";
  import { Tag, CircleUser, LogIn } from "lucide-svelte";

  import LinkScanner from "$lib/components/LinkScanner.svelte";
  import ProductList from "$lib/components/ProductList.svelte";
  import store from "$lib/store.svelte";
</script>

<!--
  Tất cả tabs đều flex-1 flex flex-col:
  - flex-1: fill toàn bộ không gian còn lại trong inner wrapper (đẩy Footer xuống đáy)
  - flex flex-col: cho phép content bên trong dùng flex-1 để fill chiều cao
-->

{#if store.activeTab === "home"}
  <div class="flex-1 flex flex-col" in:fade={{ duration: 180 }}>
    <LinkScanner />
  </div>

{:else if store.activeTab === "deals"}
  <div class="flex-1 flex flex-col" in:fade={{ duration: 180 }}>
    <ProductList />
  </div>

{:else if store.activeTab === "coupons"}
  <div
    class="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400"
    in:fade={{ duration: 180 }}
  >
    <Tag size={48} class="opacity-20" />
    <p class="font-black text-base tracking-tighter text-slate-600">Chưa có voucher nào</p>
    <p class="text-xs text-center text-slate-400 max-w-xs">
      Bấm lưu trên một deal để thêm voucher vào đây
    </p>
  </div>

{:else if store.activeTab === "account"}
  <div
    class="flex-1 flex flex-col items-center justify-center gap-4"
    in:fade={{ duration: 180 }}
  >
    {#if store.isLoggedIn}
      <CircleUser size={56} class="text-primary" />
      <p class="font-black text-lg tracking-tighter">Tài khoản</p>
    {:else}
      <LogIn size={48} class="opacity-20" />
      <p class="font-black text-base tracking-tighter text-slate-700">Đăng nhập để tiếp tục</p>
      <p class="text-xs text-slate-400 text-center max-w-xs">
        Lưu mã, theo dõi hoa hồng và nhận thông báo deal mới nhất
      </p>
      <button
        class="btn btn-primary px-10 mt-2"
        onclick={() => store.openAuth("signin")}
      >
        Đăng nhập
      </button>
    {/if}
  </div>
{/if}
