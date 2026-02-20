import type { Platform } from "./types";

export class Store {
  // Use the $state rune for reactivity
  platform = $state<Platform>("web");

  setPlatform(platform: Platform) {
    this.platform = platform;
  }
}

const store = new Store();
export default store;
