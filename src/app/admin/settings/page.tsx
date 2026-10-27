
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { 
  Settings, 
  Shield, 
  Bell, 
  Map, 
  Trash2, 
  Globe, 
  Database, 
  Key, 
  Save,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

export default function AdminSettings() {
  const { toast } = useToast()

  const handleSave = () => {
    toast({
      title: "System Config Updated",
      description: "Global settings have been pushed to all wards.",
    })
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="md:hidden">
            <Link href="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Configuration</h1>
            <p className="text-muted-foreground font-medium">Manage global app parameters and ward protocols</p>
          </div>
        </div>
        <Button onClick={handleSave} className="rounded-xl font-bold px-8 h-12 flex gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* App Config */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">General Configuration</CardTitle>
                  <CardDescription>Adjust basic app behavior and thresholds</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Municipal Portal Name</Label>
                  <Input defaultValue="WasteIQ Baripada" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Bin Capacity Threshold (%)</Label>
                  <Input type="number" defaultValue="85" className="rounded-xl h-11" />
                </div>
              </div>

              <div className="divide-y border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-muted/20">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Auto-Assign Tasks</p>
                    <p className="text-xs text-muted-foreground">Automatically assign complaints based on ward location</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/20">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Public Transparency Map</p>
                    <p className="text-xs text-muted-foreground">Allow citizens to see real-time truck locations</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Protocols */}
          <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Security & Auth Protocols</CardTitle>
                  <CardDescription>Manage administrative access and data encryption</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Password Rotation (Days)</Label>
                  <Input type="number" defaultValue="90" className="rounded-xl h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (Minutes)</Label>
                  <Input type="number" defaultValue="30" className="rounded-xl h-11" />
                </div>
              </div>
              <Button variant="outline" className="rounded-xl font-bold text-xs h-10 w-full md:w-auto">
                Review Audit Logs
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-secondary text-secondary-foreground">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 opacity-60" />
                <CardTitle className="text-sm font-bold uppercase">System Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                  <span className="font-medium opacity-70">Database Instance</span>
                  <Badge className="bg-white/20 text-foreground font-bold">AWS-MUM-01</Badge>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="font-medium opacity-70">API Health</span>
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                     <span className="font-bold">Active</span>
                  </div>
               </div>
               <div className="flex justify-between items-center text-sm">
                  <span className="font-medium opacity-70">Last Deployment</span>
                  <span className="font-bold">20 Oct 2024</span>
               </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
             <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest px-1">Quick Management</h3>
             <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-none shadow-sm bg-white hover:bg-muted group">
                <div className="flex items-center gap-3">
                   <Map className="h-4 w-4 text-primary" />
                   <span className="text-sm font-bold">Manage Wards (28)</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform rotate-180" />
             </Button>
             <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-none shadow-sm bg-white hover:bg-muted group">
                <div className="flex items-center gap-3">
                   <Trash2 className="h-4 w-4 text-primary" />
                   <span className="text-sm font-bold">Waste Categories</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform rotate-180" />
             </Button>
             <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-none shadow-sm bg-white hover:bg-muted group">
                <div className="flex items-center gap-3">
                   <Key className="h-4 w-4 text-primary" />
                   <span className="text-sm font-bold">API Access Tokens</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform rotate-180" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
