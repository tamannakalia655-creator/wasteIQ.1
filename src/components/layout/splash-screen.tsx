"use client"

import { useState, useEffect } from "react"
import { Leaf, MapPin, Sparkles, Trash2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 500)
    }, 3500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary text-white transition-opacity duration-700 ease-in-out",
      !isVisible && "opacity-0 pointer-events-none"
    )}>
      {/* Side Decorative Animated Dustbin */}
      <div className="absolute right-[-2rem] top-1/4 opacity-10 rotate-[-15deg] hidden sm:block">
        <div className="relative">
          <Trash2 className="h-48 w-48" />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 bg-white/40 rounded-t-lg animate-[shimmer_2s_infinite]" style={{ height: '40%' }} />
        </div>
      </div>

      <div className="absolute left-10 bottom-1/4 opacity-10 rotate-[15deg] hidden md:block">
        <div className="relative">
          <Trash2 className="h-32 w-32" />
          <div className="absolute top-0 right-0">
            <Zap className="h-8 w-8 text-secondary animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Animated Logo Container */}
        <div className="relative">
          {/* Radiating Rings */}
          <div className="absolute inset-0 -m-4 rounded-full border-2 border-white/20 animate-[ping_3s_linear_infinite]" />
          <div className="absolute inset-0 -m-8 rounded-full border-2 border-white/10 animate-[ping_3s_linear_infinite_1s]" />
          
          <div className="relative flex h-28 w-28 items-center justify-center rounded-[2.5rem] bg-white text-primary shadow-2xl shadow-black/20 animate-in zoom-in-50 duration-1000 ease-out">
            <Leaf className="h-14 w-14 animate-bounce" />
            
            {/* Corner Sparkle */}
            <div className="absolute -top-2 -right-2 h-8 w-8 text-secondary animate-pulse">
              <Sparkles className="h-full w-full" />
            </div>
          </div>
        </div>

        {/* Text Content with Staggered Entrance */}
        <div className="text-center space-y-3">
          <div className="overflow-hidden">
            <h1 className="text-5xl font-black tracking-tighter animate-in slide-in-from-bottom-full duration-1000">
              WasteIQ
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-2 opacity-90 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300 fill-mode-both">
            <MapPin className="h-4 w-4 text-secondary" />
            <p className="text-sm font-bold uppercase tracking-[0.2em]">
              Baripada Smart City
            </p>
          </div>

          <div className="h-px w-12 bg-white/30 mx-auto animate-in scale-x-0 duration-1000 delay-500 fill-mode-both" />

          <p className="max-w-[280px] text-xs font-medium opacity-70 animate-in fade-in duration-1000 delay-700 leading-relaxed italic px-4">
            "Smarter Waste. Cleaner City. Greener Future."
          </p>
        </div>
      </div>
      
      {/* Dynamic Progress Indicator */}
      <div className="absolute bottom-24 flex flex-col items-center gap-4 w-full px-12 max-w-xs">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
          <div className="h-full bg-secondary shadow-[0_0_15px_rgba(183,230,48,0.5)] animate-[loading_3s_ease-in-out_infinite]" />
        </div>
        <div className="flex items-center justify-between w-full opacity-50">
          <p className="text-[10px] uppercase font-black tracking-widest">Optimizing Wards</p>
          <p className="text-[10px] uppercase font-black tracking-widest">28 / 28</p>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
    </div>
  )
}
