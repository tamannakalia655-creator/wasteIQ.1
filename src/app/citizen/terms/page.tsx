"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ScrollText } from "lucide-react"
import Link from "next/link"

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 dark:bg-card/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/settings"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Terms of Service</h1>
        </div>
      </header>

      <main className="container max-w-2xl space-y-6 px-4 py-6 mx-auto">
        <div className="flex justify-center mb-4">
           <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary">
              <ScrollText className="h-8 w-8" />
           </div>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-6 space-y-8 text-sm leading-relaxed text-foreground/80">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the WasteIQ application, you agree to be bound by these Terms of Service and all applicable municipal waste management policies of Baripada. If you do not agree to these terms, please do not use the app.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">2. User Responsibilities</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide accurate information during registration and reporting.</li>
                <li>Report genuine waste issues only.</li>
                <li>Avoid submitting false or misleading complaints.</li>
                <li>Follow city-mandated waste segregation rules (Wet vs. Dry).</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">3. Prohibited Activities</h2>
              <p>Users must not use the platform to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Submit fake reports to harass workers or authorities.</li>
                <li>Upload harmful, offensive, or illegal content.</li>
                <li>Attempt to bypass security features of the application.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">4. Data Usage & Privacy</h2>
              <p>
                WasteIQ collects basic data such as your name, contact information, and location for the sole purpose of improving waste management services. Your data is handled in accordance with our Privacy Policy.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">5. Service Availability</h2>
              <p>
                While we strive for 24/7 availability, service may be interrupted for maintenance or due to municipal operational constraints. Response times for complaints depend on worker availability in your ward.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">6. Updates to Terms</h2>
              <p>
                WasteIQ reserves the right to update these terms periodically. Continued use of the app after changes indicates your acceptance of the new terms.
              </p>
            </section>

            <div className="pt-6 border-t text-[10px] text-muted-foreground font-medium uppercase text-center">
               Last Updated: October 2024 • Baripada Municipal Corporation
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
