"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, User, Briefcase, MapPin, ShieldCheck } from "lucide-react"
import { SplashScreen } from "@/components/layout/splash-screen"

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true)

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className={`flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-white shadow-xl shadow-primary/20">
            <Leaf className="h-10 w-10" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">WasteIQ Baripada</h1>
            <p className="text-muted-foreground">Smarter Waste. Cleaner City.</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-xs font-bold text-primary uppercase">
              <MapPin className="h-3 w-3" />
              Serving all 28 Wards
            </div>
          </div>
        </div>

        <div className="grid w-full max-w-sm gap-4">
          <Button asChild className="h-14 rounded-2xl text-lg font-semibold shadow-lg shadow-primary/20" variant="default">
            <Link href="/login?role=citizen" className="flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              Citizen Login
            </Link>
          </Button>
          <Button asChild className="h-14 rounded-2xl border-2 text-lg font-semibold" variant="outline">
            <Link href="/login?role=worker" className="flex items-center justify-center gap-2">
              <Briefcase className="h-5 w-5" />
              Worker Login
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="h-12 rounded-xl text-muted-foreground hover:text-primary transition-colors">
            <Link href="/login?role=admin" className="flex items-center justify-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Administrator Access
            </Link>
          </Button>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <span className="text-muted-foreground">New to WasteIQ?</span>
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Join the community
            </Link>
          </div>
        </div>

        <footer className="absolute bottom-8 text-xs text-muted-foreground">
          © 2024 WasteIQ Baripada Smart Management.
        </footer>
      </div>
    </>
  )
}
