<script lang="ts">
  import { Zap, Sparkles, ArrowRight } from "lucide-svelte";
  import { fly } from "svelte/transition";
</script>

<div
  in:fly={{ y: -20, duration: 600, delay: 100 }}
  class="relative overflow-hidden rounded-[2.5rem] bg-black p-8 text-white mb-8 group cursor-pointer shadow-2xl shadow-black/20 border border-white/5"
>
  <!-- Animated Background Accents -->
  <div class="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>
  <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-slate-500 rounded-full opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-700"></div>

  <div class="relative z-10">
    <div class="flex items-center gap-2 mb-4">
       <div class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/10">
          <Sparkles size={10} class="text-yellow-400" />
          Exclusive Drop
       </div>
       <div class="flex items-center gap-1 text-[10px] font-black text-white/40 uppercase tracking-tighter">
         <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
         Live Now
       </div>
    </div>
    
    <h2 class="text-5xl font-black italic tracking-tighter leading-[0.9] mb-2 uppercase">
      Tech Deals<br/>
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Up to -50%</span>
    </h2>
    
    <p class="text-sm font-medium text-white/50 tracking-tight mb-8 max-w-[200px] leading-snug">
      Grab the latest gadgets with verified promo codes.
    </p>
    
    <button class="group/btn relative px-8 py-3 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 overflow-hidden shadow-xl shadow-white/5">
      <span class="relative z-10">Explore Drops</span>
      <ArrowRight size={14} strokeWidth={3} class="group-hover/btn:translate-x-1 transition-transform" />
    </button>
  </div>

  <!-- Decorative Icon -->
  <div class="absolute -right-6 -bottom-6 opacity-10 rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-1000 ease-out">
    <Zap size={220} strokeWidth={1} />
  </div>
  
  <!-- Subtle Overlay Gradient -->
  <div class="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent pointer-events-none"></div>
</div>
