
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Bell, Shield, Palette, Globe, HelpCircle, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export default function CitizenSettings() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 flex items-center gap-4 bg-white/80 dark:bg-card/80 px-4 py-4 backdrop-blur-md border-b border-border/40">
        <div className="flex items-center gap-4 ml-12 md:ml-0">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-lg font-bold">Settings</h1>
        </div>
      </header>

      <main className="container max-w-2xl space-y-6 px-4 py-6 mx-auto">
        {/* Notifications */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground px-1 flex items-center gap-2">
            <Bell className="h-3 w-3" />
            Notifications
          </h3>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y">
              <div className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Pickup Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified when a truck is nearby</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Reward Milestones</Label>
                  <p className="text-xs text-muted-foreground">Alerts for new badges and points</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security & Privacy */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground px-1 flex items-center gap-2">
            <Shield className="h-3 w-3" />
            Security & Privacy
          </h3>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y">
              <Button variant="ghost" className="w-full h-auto justify-between p-4 rounded-none hover:bg-muted/50">
                <div className="text-left">
                  <p className="text-sm font-bold">Change Password</p>
                  <p className="text-xs text-muted-foreground">Last updated 3 months ago</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
              <div className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Location Sharing</Label>
                  <p className="text-xs text-muted-foreground">To find bins and centers near you</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* App Appearance */}
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
              <Button variant="ghost" className="w-full h-auto justify-between p-4 rounded-none hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-bold">Language</p>
                    <p className="text-xs text-muted-foreground">English (US)</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-muted-foreground px-1 flex items-center gap-2">
            <HelpCircle className="h-3 w-3" />
            Support
          </h3>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-0 divide-y">
              <Button variant="ghost" asChild className="w-full h-auto justify-between p-4 rounded-none hover:bg-muted/50">
                <Link href="/citizen/help">
                  <span className="text-sm font-bold">Help Center</span>
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
                <Link href="/citizen/terms">
                  <span className="text-sm font-bold">Terms of Service</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Button className="w-full h-12 rounded-xl" variant="outline">
          Save All Changes
        </Button>
      </main>
    </div>
  )
}
