"use client"

import { useState } from "react"
import { wasteDisposalAssistant, WasteDisposalAssistantOutput } from "@/ai/flows/waste-disposal-assistant"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2, Sparkles, AlertCircle, Info, Lightbulb, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DisposalGuide() {
  const [query, setQuery] = useState("")
  const [result, setResult] = useState<WasteDisposalAssistantOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await wasteDisposalAssistant({ query })
      setResult(response)
    } catch (err) {
      setError("Failed to fetch instructions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    "Pizza Box", 
    "Coconut Shell", 
    "Milk Packet", 
    "Old Charger", 
    "Sanitary Pads", 
    "Banana Peel",
    "Used Mask",
    "Chips Packet"
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Disposal Guide</h1>
        </div>
      </header>

      <main className="container max-w-2xl space-y-6 px-4 py-6 mx-auto">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Search any waste item to get eco-friendly disposal instructions powered by WasteIQ AI.
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="e.g. Soda can, Pizza box..." 
                className="pl-9 rounded-xl h-12"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="h-12 rounded-xl px-6" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask AI"}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setQuery(ex)}
                className="rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
             <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
             <p className="text-sm text-muted-foreground animate-pulse font-medium">Consulting eco-database...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-destructive/10 p-4 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <Card className="border-none shadow-xl shadow-primary/5 overflow-hidden">
              <CardHeader className="bg-primary text-white pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">{result.wasteType}</CardTitle>
                    <p className="text-xs opacity-80 uppercase tracking-wide font-medium">{result.category}</p>
                  </div>
                  <Sparkles className="h-6 w-6 opacity-60" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="flex items-start gap-4 p-5">
                    <div className="mt-1 h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                       <Trash2 className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Recommended Bin</p>
                      <p className="text-sm font-semibold">{result.bin}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5">
                    <div className="mt-1 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                       <Info className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Instructions</p>
                      <p className="text-sm leading-relaxed text-foreground/80">{result.instruction}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 bg-secondary/5">
                    <div className="mt-1 h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                       <Lightbulb className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Eco-Friendly Tip</p>
                      <p className="text-sm font-medium text-foreground/90 italic">"{result.tip}"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Button variant="outline" className="w-full h-12 rounded-xl border-dashed" onClick={() => {setResult(null); setQuery("")}}>
              Search Another Item
            </Button>
          </div>
        )}

        {!loading && !result && !error && (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-muted/50 text-muted-foreground">
              <LeafIcon className="h-8 w-8 opacity-40" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Waiting for your query...</p>
          </div>
        )}
      </main>
    </div>
  )
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8a7 7 0 0 1-10 10Z" />
      <path d="M11 20c-1.2.9-2.8 1.4-4.5 1.4A5.5 5.5 0 0 1 1 15.9c0-1.7.5-3.3 1.4-4.5" />
      <path d="M11 20 21 10" />
    </svg>
  )
}
