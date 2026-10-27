
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CHART_DATA, ADMIN_STATS } from "@/app/lib/mock-data"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart
} from "recharts"
import { 
  BarChart3, 
  Download, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Trash2, 
  Recycle,
  AlertTriangle,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground font-medium">Comprehensive system performance metrics for Baripada</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl font-bold flex gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
          <Button className="rounded-xl font-bold flex gap-2">
            <Download className="h-4 w-4" />
            Export Full Report
          </Button>
        </div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Waste Collected", value: "24.5 Tons", sub: "+12% vs last month", icon: Trash2, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Recycling Rate", value: `${ADMIN_STATS.recyclingRate}%`, sub: "+4% improvement", icon: Recycle, color: "text-primary", bg: "bg-primary/10" },
          { label: "Avg Response Time", value: "1.2 Hours", sub: "-15m vs last week", icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Critical Alerts", value: "08", sub: "Currently active", icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">{stat.label}</p>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-[10px] font-medium text-primary">{stat.sub}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection Volume Chart */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Waste Volume Trends</CardTitle>
            <p className="text-xs text-muted-foreground">Daily collection volume in metric tons</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="collected" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Complaints Analysis */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Complaints vs Resolution</CardTitle>
            <p className="text-xs text-muted-foreground">Monitoring response efficiency across wards</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="complaints" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ward Performance Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold">Top Performing Wards</CardTitle>
          <Button variant="ghost" className="text-xs font-bold text-primary flex gap-2">
            Detailed Ward Reports
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-y">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-[10px] uppercase text-muted-foreground">Ward</th>
                  <th className="px-6 py-4 text-left font-bold text-[10px] uppercase text-muted-foreground">Compliance</th>
                  <th className="px-6 py-4 text-left font-bold text-[10px] uppercase text-muted-foreground">Cleanliness Index</th>
                  <th className="px-6 py-4 text-left font-bold text-[10px] uppercase text-muted-foreground">Recycling Score</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { ward: "Ward 12 - Baghra Road", compliance: "98%", score: 94, recycling: 72 },
                  { ward: "Ward 05 - Station Bazar", compliance: "95%", score: 88, recycling: 68 },
                  { ward: "Ward 22 - Bhanjpur", compliance: "92%", score: 85, recycling: 65 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold">{row.ward}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-12 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{width: row.compliance}} />
                        </div>
                        <span className="font-medium">{row.compliance}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">{row.score} / 100</td>
                    <td className="px-6 py-4 font-medium">{row.recycling}% Rate</td>
                    <td className="px-6 py-4 text-right">
                       <Button variant="ghost" size="sm" className="h-8 rounded-lg">
                          <FileText className="h-4 w-4" />
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
