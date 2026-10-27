"use client"

import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const FAQS = [
  {
    q: "What is WasteIQ?",
    a: "WasteIQ is a smart waste management platform that helps citizens report waste issues, locate smart bins, and learn proper waste disposal methods in Baripada."
  },
  {
    q: "How do I report a waste complaint?",
    a: "Go to 'Report an Issue' from your dashboard, upload a photo of the waste, add a description and location, then submit. A worker will be assigned to resolve it."
  },
  {
    q: "How does the Disposal Guide work?",
    a: "Use our AI-powered Disposal Guide to enter any waste item name. It will instantly tell you the correct bin type (Wet, Dry, Recyclable, or Hazardous) and preparation steps."
  },
  {
    q: "How can I earn rewards?",
    a: "You earn eco-points by reporting successful disposals, participating in clean-up drives, and consistently using the app to manage waste responsibly."
  },
  {
    q: "Can I track my complaint status?",
    a: "Yes. You will receive notifications when your report is assigned, in-progress, and completed. You can also view status updates in your activity history."
  },
  {
    q: "What do the bin colors mean?",
    a: "🟢 Green for Wet Waste (Compostable), 🔵 Blue for Dry Waste, 🟡 Yellow for Recyclable materials, and 🔴 Red for Hazardous Waste."
  },
  {
    q: "Who handles my complaint?",
    a: "Your complaints are directly routed to the municipal sanitation workers assigned to your specific ward in Baripada."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 dark:bg-card/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/settings"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Frequently Asked Questions</h1>
        </div>
      </header>

      <main className="container max-w-2xl space-y-6 px-4 py-6 mx-auto">
        <div className="relative mb-6">
           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
           <Input placeholder="Search questions..." className="pl-9 h-12 rounded-xl bg-white dark:bg-card border-none shadow-sm" />
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQS.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-none bg-white dark:bg-card rounded-2xl shadow-sm px-4">
              <AccordionTrigger className="text-sm font-bold text-left hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="py-10 text-center">
           <p className="text-sm text-muted-foreground mb-4">Didn't find what you were looking for?</p>
           <Button variant="outline" className="rounded-full px-6 border-primary text-primary font-bold" asChild>
             <Link href="/citizen/help">Contact Support</Link>
           </Button>
        </div>
      </main>
    </div>
  )
}
