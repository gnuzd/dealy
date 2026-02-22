<script lang="ts">
  import clsx from "clsx";
  import { match } from "ts-pattern";
  import { ChevronRight, LayoutGrid, List } from "lucide-svelte";
  import type { RecordModel } from "pocketbase";

  import store from "$lib/store.svelte";
  import pb from "$lib/pb";
  import { onMount } from "svelte";
  import OfferCard from "./OfferCard.svelte";

  let deals = $state<RecordModel[]>([]);

  async function fetchInitialOffers() {
    const result = await pb.collection("offers").getList(1, 50, {
      sort: "-created",
    });
    deals = result.items;
  }

  onMount(async () => {
    await fetchInitialOffers();

    pb.collection("offers").subscribe("*", ({ action, record }) => {
      match(action)
        .with("create", () => (deals = [record, ...deals]))
        .with(
          "update",
          () => (deals = deals.map((p) => (p.id === record.id ? record : p))),
        )
        .with(
          "delete",
          () => (deals = deals.filter((p) => p.id !== record.id)),
        );
    });
  });
</script>

<div class="flex items-center justify-between mb-4">
  <h3 class="font-bold text-lg">Daily Drops</h3>
  <div class="join">
    <button class="btn btn-xs btn-square join-item btn-active"
      ><LayoutGrid size={14} /></button
    >
    <button class="btn btn-xs btn-square join-item"><List size={14} /></button>
  </div>
</div>

<div
  class={clsx(
    "grid gap-4",
    match(store.platform)
      .with("mobile", () => "grid-cols-1")
      // .with("desktop", () => "grid-cols-2 lg:grid-cols-3")
      .otherwise(() => "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"),
  )}
>
  {#each deals as offer}
    <OfferCard data={offer} />
  {:else}
    <p>Đang quét deal mới...</p>
  {/each}
</div>
