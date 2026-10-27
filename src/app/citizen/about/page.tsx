"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft, 
  Leaf, 
  Target, 
  Sparkles, 
  Users, 
  Briefcase, 
  Globe, 
  Recycle, 
  Zap, 
  Building2,
  CheckCircle2,
  Heart
} from "lucide-react"
import Link from "next/link"

export default function AboutWasteIQ() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 dark:bg-card/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">About WasteIQ</h1>
        </div>
      </header>

      <main className="container max-w-3xl space-y-12 px-4 py-10 mx-auto">
        {/* 1. App Introduction */}
        <section className="text-center space-y-6">
           <div className="mx-auto h-24 w-24 rounded-[2.5rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 animate-in zoom-in duration-700">
              <Leaf className="h-12 w-12" />
           </div>
           <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Smarter Waste. Cleaner City.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                WasteIQ is a smart waste management platform designed to transform how cities handle waste by combining technology, citizen participation, and sustainability practices.
              </p>
           </div>
        </section>

        {/* 2 & 3. Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none bg-primary/5 shadow-none rounded-3xl">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Our Mission</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                “To create cleaner, greener, and smarter cities by promoting responsible waste disposal and efficient waste management systems.”
              </p>
            </CardContent>
          </Card>

          <Card className="border-none bg-secondary/10 shadow-none rounded-3xl">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Our Vision</h3>
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                “To build a sustainable future where every citizen actively contributes to waste reduction and environmental protection.”
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 4. Sustainability Commitment */}
        <section className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Sustainability Commitment</h3>
            <p className="text-muted-foreground">Our promise to the environment and the future.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Promote waste segregation at source",
              "Reduce landfill waste",
              "Encourage recycling and reuse",
              "Support eco-friendly habits in daily life",
              "Reduce carbon footprint via efficient collection"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-card border border-border/50 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Key Features */}
        <section className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Innovation at Work</h3>
            <p className="text-muted-foreground">Modern tools for a modern city.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { title: "Smart Bin Monitoring", icon: Zap },
              { title: "Waste Disposal Guide", icon: Sparkles },
              { title: "Complaint Reporting", icon: Building2 },
              { title: "Recycling & Rewards", icon: Recycle },
              { title: "Real-Time Tracking", icon: Globe },
              { title: "Map-based Management", icon: Briefcase },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 p-6 rounded-3xl bg-white dark:bg-card border border-border/50 shadow-sm group hover:border-primary/50 transition-colors">
                 <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <f.icon className="h-6 w-6" />
                 </div>
                 <h4 className="font-bold text-xs uppercase tracking-tight leading-tight">{f.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Impact on Community */}
        <section className="space-y-6 pt-4">
          <h3 className="text-2xl font-bold text-center">Community Impact</h3>
          <div className="space-y-4">
             <div className="p-6 rounded-3xl bg-white dark:bg-card shadow-sm border space-y-4">
                <div className="flex items-center gap-3">
                   <Users className="h-6 w-6 text-primary" />
                   <h4 className="font-bold">For Citizens</h4>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">• Cleaner surroundings</li>
                  <li className="flex items-center gap-2">• Easy waste reporting</li>
                  <li className="flex items-center gap-2">• Disposal awareness</li>
                </ul>
             </div>
             
             <div className="p-6 rounded-3xl bg-white dark:bg-card shadow-sm border space-y-4">
                <div className="flex items-center gap-3">
                   <Briefcase className="h-6 w-6 text-secondary-foreground" />
                   <h4 className="font-bold">For Workers</h4>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">• Better task management</li>
                  <li className="flex items-center gap-2">• Efficient routes</li>
                  <li className="flex items-center gap-2">• Faster resolution</li>
                </ul>
             </div>

             <div className="p-6 rounded-3xl bg-white dark:bg-card shadow-sm border space-y-4">
                <div className="flex items-center gap-3">
                   <Building2 className="h-6 w-6 text-blue-500" />
                   <h4 className="font-bold">For Cities</h4>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">• Improved cleanliness scores</li>
                  <li className="flex items-center gap-2">• Better waste tracking</li>
                  <li className="flex items-center gap-2">• Data-driven decisions</li>
                </ul>
             </div>
          </div>
        </section>

        {/* 7. Smart City Integration */}
        <Card className="border-none bg-primary text-white overflow-hidden rounded-[2rem] shadow-xl shadow-primary/20">
          <CardContent className="p-10 text-center space-y-4">
            <Building2 className="h-12 w-12 mx-auto opacity-50" />
            <h3 className="text-2xl font-bold">Smart City Integration</h3>
            <p className="text-primary-foreground/90 leading-relaxed max-w-md mx-auto">
              WasteIQ helps municipalities adopt digital waste management systems, making cities more efficient, sustainable, and environmentally responsible.
            </p>
          </CardContent>
        </Card>

        {/* 8. Call to Action */}
        <section className="text-center py-10 space-y-6">
           <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 animate-pulse" />
           </div>
           <div className="space-y-2">
              <h3 className="text-2xl font-bold">Be the Change</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                “Join WasteIQ and be a part of the movement towards a cleaner and greener tomorrow.”
              </p>
           </div>
           <Button asChild className="rounded-full px-8 h-12 text-lg font-bold shadow-lg shadow-primary/20">
              <Link href="/citizen/dashboard">Get Started Today</Link>
           </Button>
        </section>

        <footer className="text-center space-y-4 pt-10 border-t border-border/50">
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
              WasteIQ Baripada • Version 1.0.0
           </p>
           <div className="flex justify-center gap-6 opacity-40">
              <Globe className="h-4 w-4" />
              <Leaf className="h-4 w-4" />
              <Recycle className="h-4 w-4" />
           </div>
        </footer>
      </main>
    </div>
  )
}
