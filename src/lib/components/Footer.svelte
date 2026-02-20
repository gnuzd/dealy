<script lang="ts">
  import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-svelte";
  import store from "$lib/store.svelte";
</script>

{#if store.platform === "web"}
  <footer class="footer p-10 text-base-content mt-20">
    <div class="flex w-full">
      <aside class="flex-1">
        <div class="btn btn-primary btn-square btn-md font-black text-2xl mb-4">
          D
        </div>
        <p class="font-bold text-lg">
          Dealy Platform
          <br />
          <span class="text-sm font-normal opacity-60"
            >Smart shopping, better living.</span
          >
        </p>
        <div class="flex gap-4 mt-4">
          <button class="btn btn-ghost btn-xs btn-circle"
            ><Facebook size={16} /></button
          >
          <button class="btn btn-ghost btn-xs btn-circle"
            ><Twitter size={16} /></button
          >
          <button class="btn btn-ghost btn-xs btn-circle"
            ><Instagram size={16} /></button
          >
          <button class="btn btn-ghost btn-xs btn-circle"
            ><Github size={16} /></button
          >
        </div>
      </aside>
      <ul class="menu flex-1">
        <li>
          <h6 class="footer-title opacity-100 font-black text-primary">
            Features
          </h6>
        </li>
        <li><a href="/" class="link link-hover">Price Tracker</a></li>
        <li><a href="/" class="link link-hover">Browser Extension</a></li>
        <li><a href="/" class="link link-hover">Mobile Alerts</a></li>
        <li><a href="/" class="link link-hover">Price History</a></li>
      </ul>
      <ul class="menu flex-1">
        <li>
          <h6 class="footer-title opacity-100 font-black text-primary">
            Company
          </h6>
        </li>
        <li><a href="/" class="link link-hover">About us</a></li>
        <li><a href="/" class="link link-hover">Contact</a></li>
        <li><a href="/" class="link link-hover">Jobs</a></li>
        <li><a href="/" class="link link-hover">Press kit</a></li>
      </ul>
      <form class="flex-1">
        <h6 class="footer-title opacity-100 font-black text-primary">
          Newsletter
        </h6>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Enter your email address</legend>
          <div class="join">
            <input
              id="email"
              type="text"
              placeholder="username@site.com"
              class="input input-bordered join-item bg-base-200"
            />
            <button class="btn btn-primary join-item">Subscribe</button>
          </div>
        </fieldset>
      </form>
    </div>

    <div class="flex items-center justify-between w-full">
      <aside class="items-center grid-flow-col">
        <p>© 2026 Dealy Inc. All rights reserved.</p>
      </aside>
      <nav class="md:place-self-center md:justify-self-end">
        <div
          class="grid grid-flow-col gap-4 text-xs font-bold opacity-50 uppercase tracking-widest"
        >
          <a href="/" class="link link-hover">Privacy</a>
          <a href="/" class="link link-hover">Terms</a>
          <a href="/" class="link link-hover">Cookies</a>
        </div>
      </nav>
    </div>
  </footer>
{/if}
