
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ADMIN_STATS, CHART_DATA } from "@/app/lib/mock-data"
import { 
  Users, 
  Briefcase, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  Recycle, 
  ArrowUpRight,
  Loader2,
  Bell
} from "lucide-react"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  XAxis, 
  Tooltip,
  Cell
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase"
import { collection, query, where, doc } from "firebase/firestore"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function AdminDashboard() {
  const db = useFirestore()
  const { user } = useUser()

  // Verify role before querying to prevent permission errors
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid)
  }, [db, user?.uid])
  const { data: userData } = useDoc(userRef)
  
  const isAdmin = userData?.role === 'admin'

  // 1. Fetch real workers count
  const workersQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    return query(collection(db, "users"), where("role", "==", "worker"))
  }, [db, isAdmin])
  const { data: workers, isLoading: isWorkersLoading } = useCollection(workersQuery)

  // 2. Fetch real citizens count
  const citizensQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    return query(collection(db, "users"), where("role", "==", "citizen"))
  }, [db, isAdmin])
  const { data: citizens, isLoading: isCitizensLoading } = useCollection(citizensQuery)

  // 3. Fetch real complaints
  const complaintsQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    return collection(db, "complaints")
  }, [db, isAdmin])
  const { data: complaints, isLoading: isComplaintsLoading } = useCollection(complaintsQuery)

  const stats = [
    { 
      label: "Total Citizens", 
      val: citizens?.length ?? 0, 
      loading: isCitizensLoading,
      icon: Users, 
      color: "text-blue-500", 
      bg: "bg-blue-50" 
    },
    { 
      label: "On-Duty Workers", 
      val: workers?.length ?? 0, 
      loading: isWorkersLoading,
      icon: Briefcase, 
      color: "text-green-500", 
      bg: "bg-green-50" 
    },
    { 
      label: "Active Smart Bins", 
      val: ADMIN_STATS.totalBins, 
      loading: false,
      icon: Trash2, 
      color: "text-primary", 
      bg: "bg-primary/10" 
    },
    { 
      label: "Active Complaints", 
      val: complaints?.length ?? 0, 
      loading: isComplaintsLoading,
      icon: AlertTriangle, 
      color: "text-orange-500", 
      bg: "bg-orange-50" 
    },
  ]

  if (!isAdmin && userData) return null

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
          <p className="text-muted-foreground">Real-time monitoring of Baripada Waste Management</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button variant="ghost" size="icon" className="relative mr-2" asChild>
            <Link href="/admin/notifications">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </Link>
          </Button>
          <Button variant="outline" className="rounded-xl font-bold">Export Report</Button>
          <Button className="rounded-xl font-bold">Generate PDF</Button>
        </div>
      </header>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                {stat.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold">
                  {stat.loading ? "..." : stat.val.toLocaleString()}
                </h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Graph */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Waste Collection Trends</CardTitle>
            <p className="text-xs text-muted-foreground">Average tonnage collected per day this week</p>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <Tooltip cursor={{fill: 'hsl(var(--muted))'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="collected" radius={[6, 6, 0, 0]}>
                  {CHART_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 5 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.4)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Efficiency Stats */}
        <div className="space-y-4">
          <Card className="border-none shadow-sm bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <TrendingUp className="h-8 w-8 opacity-50" />
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">+4.2%</span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold">{ADMIN_STATS.cityScore}%</h3>
                <p className="text-sm opacity-80 font-medium">City Cleanliness Index</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-secondary text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Recycle className="h-8 w-8 opacity-50" />
                <span className="text-xs font-bold bg-black/5 px-2 py-1 rounded-full">+12% goal</span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold">{ADMIN_STATS.recyclingRate}%</h3>
                <p className="text-sm opacity-80 font-medium">Community Recycling Rate</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold">Urgent Complaints</CardTitle>
            <p className="text-xs text-muted-foreground">Recent reports across 28 wards</p>
          </div>
          <Button variant="ghost" size="sm" className="font-bold text-primary" asChild>
            <Link href="/admin/complaints">View All Reports</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-y">
                <tr>
                  <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">ID</th>
                  <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Citizen</th>
                  <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Issue</th>
                  <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Ward</th>
                  <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(complaints || []).slice(0, 5).map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-bold">{complaint.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4">{complaint.citizenName || 'Anonymous'}</td>
                    <td className="px-6 py-4 font-medium">{complaint.type}</td>
                    <td className="px-6 py-4 text-muted-foreground">{complaint.location}</td>
                    <td className="px-6 py-4">
                      <Badge variant={complaint.status === 'Resolved' ? 'secondary' : 'outline'} className="rounded-lg text-[10px] uppercase font-bold">
                        {complaint.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <span className={cn(
                         "text-[10px] font-bold uppercase px-2 py-1 rounded-md",
                         complaint.priority === 'Critical' ? "bg-red-100 text-red-700" : 
                         complaint.priority === 'High' ? "bg-orange-100 text-orange-700" : 
                         "bg-blue-100 text-blue-700"
                       )}>
                         {complaint.priority}
                       </span>
                    </td>
                  </tr>
                ))}
                {(!complaints || complaints.length === 0) && !isComplaintsLoading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">No complaints reported yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
