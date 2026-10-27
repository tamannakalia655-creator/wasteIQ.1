"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bell, Shield, Map, HelpCircle, ChevronRight, Palette } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export default function WorkerSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 dark:bg-card/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/worker/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Worker Settings</h1>
        </div>
      </header>

      <main className="container max-w-2xl space-y-6 px-4 py-6 mx-auto">
        {/* Duty Notifications */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground px-1 flex items-center gap-2">
            <Bell className="h-3 w-3" />
            Job Alerts
          </h3>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y">
              <div className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">New Task Assigned</Label>
                  <p className="text-xs text-muted-foreground">Immediate alert for new collection tasks</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Emergency Complaints</Label>
                  <p className="text-xs text-muted-foreground">High priority citizen reports</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appearance */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground px-1 flex items-center gap-2">
            <Palette className="h-3 w-3" />
            Appearance
          </h3>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y">
              <div className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">Easier on the eyes in low light</p>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground px-1 flex items-center gap-2">
            <HelpCircle className="h-3 w-3" />
            Resources
          </h3>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y">
              <Button variant="ghost" asChild className="w-full h-auto justify-between p-4 rounded-none hover:bg-muted/50">
                <Link href="/citizen/help">
                  <span className="text-sm font-bold">Worker Help Center</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full h-auto justify-between p-4 rounded-none hover:bg-muted/50">
                <Link href="/citizen/faq">
                  <span className="text-sm font-bold">FAQ</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="ghost" asChild className="w-full h-auto justify-between p-4 rounded-none hover:bg-muted/50">
                <Link href="/citizen/about">
                  <span className="text-sm font-bold">About WasteIQ</span>
                  <span className="text-xs text-muted-foreground">v1.2.0</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
          Apply Settings
        </Button>
      </main>
    </div>
  )
}
