<script lang="ts">
  import clsx from "clsx";
  import { match } from "ts-pattern";
  import { ChevronRight, LayoutGrid, List } from "lucide-svelte";
  import type { RecordModel } from "pocketbase";

  import store from "$lib/store.svelte";
  import pb from "$lib/pb";
  import { onMount } from "svelte";

  let deals = $state<RecordModel[]>([]);

  async function fetchInitialProducts() {
    const result = await pb.collection("deals").getList(1, 50, {
      sort: "-created",
    });
    deals = result.items;
    console.log(deals);
  }

  onMount(async () => {
    await fetchInitialProducts();

    pb.collection("deals").subscribe("*", ({ action, record }) => {
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
      .with("desktop", () => "grid-cols-2 lg:grid-cols-3")
      .otherwise(() => "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"),
  )}
>
  {#each deals as deal}
    <div
      class="card card-compact bg-base-100 shadow-sm border border-base-300 group hover:shadow-md transition-all"
    >
      <figure class="px-3 pt-3">
        <div
          class="w-full aspect-video bg-base-200 rounded-xl flex items-center justify-center text-4xl group-hover:scale-105 transition-transform"
        >
          {deal.img}
        </div>
      </figure>
      <div class="card-body">
        <div class="flex justify-between items-center">
          <span class="text-[10px] font-bold text-primary uppercase"
            >{deal.category}</span
          >
          <span class="badge badge-error badge-sm font-bold"
            >-{deal.discount}%</span
          >
        </div>
        <h4 class="card-title text-sm">{deal.name}</h4>
        <div class="flex items-baseline gap-2 mt-2">
          <span class="text-xl font-bold">${deal.price}</span>
          <span class="text-xs line-through opacity-30">${deal.oldPrice}</span>
        </div>
        <div class="card-actions justify-end mt-2">
          <button class="btn btn-primary btn-sm btn-circle">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  {:else}
    <p>Đang quét deal mới...</p>
  {/each}
</div>
