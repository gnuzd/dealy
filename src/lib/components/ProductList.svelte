<script lang="ts">
  import { onMount } from "svelte";
  import clsx from "clsx";
  import { match } from "ts-pattern";
  import { LayoutGrid, List, Zap } from "lucide-svelte";
  import type { RecordModel } from "pocketbase";

  import store from "$lib/store.svelte";
  import pb from "$lib/pb";
  import OfferCard from "./OfferCard.svelte";

  let deals = $state<RecordModel[]>([]);
  let loading = $state(true);

  async function fetchInitialOffers() {
    const result = await pb.collection("offers").getList(1, 50, {
      sort: "-created",
    });
    deals = result.items;
    loading = false;
  }

  onMount(async () => {
    await fetchInitialOffers();

    pb.collection("offers").subscribe("*", ({ action, record }) => {
      match(action)
        .with("create", () => (deals = [record, ...deals]))
        .with("update", () => (deals = deals.map((p) => (p.id === record.id ? record : p))))
        .with("delete", () => (deals = deals.filter((p) => p.id !== record.id)))
        .otherwise(() => {});
    });
  });
</script>

<div class="flex items-center justify-between mb-4">
  <h3 class="font-black text-lg tracking-tighter">Daily Drops</h3>
  <div class="join">
    <button class="btn btn-xs btn-square join-item btn-active"><LayoutGrid size={14} /></button>
    <button class="btn btn-xs btn-square join-item"><List size={14} /></button>
  </div>
</div>

<div
  class={clsx(
    "grid gap-4",
    match(store.platform)
      .with("mobile", () => "grid-cols-1")
      .otherwise(() => "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"),
  )}
>
  {#if loading}
    {#each Array(8) as _}
      <div class="skeleton h-36 w-full rounded-3xl"></div>
    {/each}
  {:else if deals.length === 0}
    <div class="col-span-full flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
      <Zap size={40} class="opacity-30" />
      <p class="font-bold text-sm tracking-tight">Đang quét deal mới...</p>
    </div>
  {:else}
    {#each deals as offer (offer.id)}
      <OfferCard data={offer} />
    {/each}
  {/if}
</div>
