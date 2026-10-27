
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2, ClipboardCheck, Trash2, ShieldCheck, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function WorkReport() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      toast({
        title: "Report Submitted",
        description: "Official work log for today has been recorded.",
      })
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold">Good Job today!</h1>
        <p className="text-muted-foreground mt-2 max-w-xs">Your daily performance stats have been synced with the municipal database.</p>
        <Button asChild className="mt-8 rounded-xl h-12 px-8 font-bold">
          <Link href="/worker/dashboard">Back to Duty Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 px-4 py-4 backdrop-blur-md border-b">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/worker/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Submit Daily Report</h1>
        </div>
      </header>

      <main className="container max-w-lg space-y-6 px-4 py-6 mx-auto">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Work Log</CardTitle>
                <CardDescription>Shift Summary • Ward 12</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bins Emptied</Label>
                  <Input type="number" placeholder="0" className="rounded-xl h-11" required />
                </div>
                <div className="space-y-2">
                  <Label>Tasks Resolved</Label>
                  <Input type="number" placeholder="0" className="rounded-xl h-11" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Total Waste Collected (KG approx)</Label>
                <div className="relative">
                  <Input type="number" placeholder="0.0" className="rounded-xl h-11 pr-12" required />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground uppercase">KG</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Shift Remarks</Label>
                <Textarea placeholder="Any issues or observations today?" className="rounded-xl min-h-[100px] resize-none" />
              </div>

              <div className="rounded-xl bg-muted/50 p-4 flex gap-3 border border-border/50">
                 <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0" />
                 <p className="text-[11px] text-muted-foreground leading-relaxed">
                   By submitting, you confirm that these stats accurately represent your fieldwork for the current shift.
                 </p>
              </div>

              <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle2 className="h-5 w-5 mr-2" />}
                {loading ? "Syncing..." : "Finalize Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
