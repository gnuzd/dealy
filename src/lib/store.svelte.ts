import type { Platform, Tab } from "./types";

export interface ToastMessage {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

export class Store {
  platform = $state<Platform>("web");
  activeTab = $state<Tab>("home");
  isLoggedIn = $state(false);

  // Auth modal
  showAuthModal = $state(false);
  authMode = $state<"signin" | "signup">("signin");

  // Toasts
  toasts = $state<ToastMessage[]>([]);

  setPlatform(platform: Platform) {
    this.platform = platform;
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
  }

  openAuth(mode: "signin" | "signup" = "signin") {
    this.authMode = mode;
    this.showAuthModal = true;
  }

  closeAuth() {
    this.showAuthModal = false;
  }

  login() {
    this.isLoggedIn = true;
    this.showAuthModal = false;
  }

  logout() {
    this.isLoggedIn = false;
  }
  
  showToast(message: string, type: ToastMessage['type'] = 'info', duration = 3000) {
    const id = Date.now();
    this.toasts = [...this.toasts, { id, message, type }];
    
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, duration);
    }
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}

const store = new Store();
export default store;
