import type { Platform, Tab } from "./types";

export class Store {
  platform = $state<Platform>("web");
  activeTab = $state<Tab>("home");
  isLoggedIn = $state(false);

  // Auth modal
  showAuthModal = $state(false);
  authMode = $state<"signin" | "signup">("signin");

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
}

const store = new Store();
export default store;
