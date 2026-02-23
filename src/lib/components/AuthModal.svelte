<script lang="ts">
  import { fade, fly } from "svelte/transition";
  import { X, Eye, EyeOff } from "lucide-svelte";
  import store from "$lib/store.svelte";

  let mode = $state(store.authMode);
  let email = $state("");
  let name = $state("");
  let password = $state("");
  let showPassword = $state(false);
  let loading = $state(false);
  let error = $state<string | null>(null);

  // Sync mode khi store.authMode thay đổi (ví dụ click "Đăng ký" từ bên ngoài)
  $effect(() => {
    mode = store.authMode;
  });

  function close() {
    store.closeAuth();
    error = null;
  }

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      error = "Vui lòng điền đầy đủ thông tin.";
      return;
    }
    if (mode === "signup" && !name.trim()) {
      error = "Vui lòng nhập tên hiển thị.";
      return;
    }

    loading = true;
    error = null;

    try {
      // TODO: kết nối PocketBase auth
      // if (mode === "signin") await pb.collection("users").authWithPassword(email, password);
      // else await pb.collection("users").create({ name, email, password });
      await new Promise((r) => setTimeout(r, 800)); // placeholder
      store.login();
    } catch {
      error = mode === "signin"
        ? "Email hoặc mật khẩu không đúng."
        : "Đăng ký thất bại. Vui lòng thử lại.";
    } finally {
      loading = false;
    }
  }

  function switchMode() {
    mode = mode === "signin" ? "signup" : "signin";
    error = null;
  }
</script>

{#if store.showAuthModal}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    in:fade={{ duration: 150 }}
    out:fade={{ duration: 100 }}
    onclick={close}
    role="dialog"
    aria-modal="true"
  >
    <!-- Modal card — bottom sheet on mobile, centered on sm+ -->
    <div
      class="bg-base-100 w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl"
      in:fly={{ y: 40, duration: 280 }}
      out:fly={{ y: 40, duration: 180 }}
      onclick={(e) => e.stopPropagation()}
    >
      <!-- Top handle (mobile) -->
      <div class="flex justify-center pt-3 pb-1 sm:hidden">
        <div class="w-10 h-1 rounded-full bg-base-300"></div>
      </div>

      <div class="p-6 sm:p-8">
        <!-- Header -->
        <div class="flex items-start justify-between mb-6">
          <div>
            <h2 class="font-black text-xl tracking-tighter">
              {mode === "signin" ? "Chào mừng trở lại" : "Tạo tài khoản"}
            </h2>
            <p class="text-sm text-base-content/50 mt-0.5">
              {mode === "signin"
                ? "Đăng nhập để lưu deal & theo dõi hoa hồng"
                : "Miễn phí — không cần thẻ tín dụng"}
            </p>
          </div>
          <button class="btn btn-ghost btn-sm btn-circle -mr-2 -mt-1" onclick={close}>
            <X size={16} />
          </button>
        </div>

        <!-- Mode switcher -->
        <div class="grid grid-cols-2 gap-1 p-1 bg-base-200 rounded-2xl mb-6">
          <button
            class="btn btn-sm {mode === 'signin' ? 'btn-primary' : 'btn-ghost text-base-content/50'}"
            onclick={() => { mode = "signin"; error = null; }}
          >
            Đăng nhập
          </button>
          <button
            class="btn btn-sm {mode === 'signup' ? 'btn-primary' : 'btn-ghost text-base-content/50'}"
            onclick={() => { mode = "signup"; error = null; }}
          >
            Đăng ký
          </button>
        </div>

        <!-- Form -->
        <form
          class="flex flex-col gap-4"
          onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          {#if mode === "signup"}
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Tên hiển thị
              </label>
              <input
                type="text"
                bind:value={name}
                placeholder="Nguyen Van A"
                class="input input-bordered w-full"
                autocomplete="name"
              />
            </div>
          {/if}

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              bind:value={email}
              placeholder="you@example.com"
              class="input input-bordered w-full"
              autocomplete="email"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
                Mật khẩu
              </label>
              {#if mode === "signin"}
                <button type="button" class="text-xs text-base-content/50 hover:text-primary transition-colors">
                  Quên mật khẩu?
                </button>
              {/if}
            </div>
            <div class="relative">
              <input
                type={showPassword ? "text" : "password"}
                bind:value={password}
                placeholder="••••••••"
                class="input input-bordered w-full pr-10"
                autocomplete={mode === "signin" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70"
                onclick={() => (showPassword = !showPassword)}
              >
                {#if showPassword}
                  <EyeOff size={16} />
                {:else}
                  <Eye size={16} />
                {/if}
              </button>
            </div>
          </div>

          {#if error}
            <p class="text-xs text-error font-medium" in:fade={{ duration: 150 }}>{error}</p>
          {/if}

          <button
            type="submit"
            class="btn btn-primary w-full font-black mt-1"
            disabled={loading}
          >
            {#if loading}
              <span class="loading loading-spinner loading-sm"></span>
            {:else}
              {mode === "signin" ? "Đăng nhập" : "Tạo tài khoản miễn phí"}
            {/if}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider text-xs text-base-content/30 my-4">hoặc tiếp tục với</div>

        <!-- Social login (placeholder) -->
        <div class="grid grid-cols-2 gap-2">
          <button class="btn btn-outline btn-sm font-semibold text-xs">
            <svg class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button class="btn btn-outline btn-sm font-semibold text-xs">
            <svg class="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <!-- Switch mode link -->
        <p class="text-center text-xs text-base-content/50 mt-4">
          {mode === "signin" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          <button class="font-semibold text-primary hover:underline ml-1" onclick={switchMode}>
            {mode === "signin" ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  </div>
{/if}
