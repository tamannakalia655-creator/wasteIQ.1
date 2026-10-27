
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Mail, Phone, MapPin, MoreVertical, Loader2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from "@/firebase"
import { collection, query, where, orderBy, doc } from "firebase/firestore"

export default function UserManagement() {
  const db = useFirestore()
  const { user } = useUser()
  const [search, setSearch] = useState("")

  // Guard: Verify admin status before listing users
  const userRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid)
  }, [db, user?.uid])
  
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userRef)
  const isAdmin = !isUserDataLoading && userData?.role === 'admin'

  const citizensQuery = useMemoFirebase(() => {
    if (!db || !isAdmin) return null
    return query(
      collection(db, "users"), 
      where("role", "==", "citizen")
    )
  }, [db, isAdmin])

  const { data: citizens, isLoading } = useCollection(citizensQuery)

  const filteredCitizens = (citizens || [])
    .filter(u => 
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => (a.email || "").localeCompare(b.email || ""))

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Citizen Database</h1>
        <p className="text-muted-foreground">Monitor user activity and community engagement across Baripada</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, ID or email..." 
            className="pl-10 h-12 rounded-xl border-none bg-white shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 font-bold flex gap-2">
          <Filter className="h-4 w-4" />
          Advanced Filters
        </Button>
      </div>

      {(isUserDataLoading || (isLoading && !citizens)) ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Synchronizing database...</p>
        </div>
      ) : (
        <Card className="border-none shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Citizen</th>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Contact</th>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Ward</th>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredCitizens.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold">{user.fullName || 'Anonymous User'}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">ID: {user.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="space-y-1">
                           <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                             <Mail className="h-3 w-3" />
                             {user.email}
                           </div>
                           {user.mobileNumber && (
                             <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                               <Phone className="h-3 w-3" />
                               {user.mobileNumber}
                             </div>
                           )}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <MapPin className="h-3 w-3 text-primary" />
                          Ward {user.wardId || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default" className="rounded-lg text-[10px] uppercase font-bold bg-primary/10 text-primary border-none">
                          Active
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="rounded-xl">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredCitizens.length === 0 && !isLoading && (
                    <tr>
                      <td colSpan={5} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Users className="h-10 w-10 opacity-20" />
                          <p>No citizens found in the system yet.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
