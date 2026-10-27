
"use client"

import { LEADERBOARD } from "@/app/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Crown, Star, Gift, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"
import { cn } from "@/lib/utils"

export default function Rewards() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, "citizenProfile", "profile")
  }, [db, user?.uid])

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef)

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentPoints = profileData?.totalRewardPoints ?? 0
  const nextMilestone = 500
  const pointsLeft = Math.max(0, nextMilestone - currentPoints)
  const progressPercent = Math.min(100, (currentPoints / nextMilestone) * 100)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-primary px-4 py-8 text-white rounded-b-[2rem] shadow-lg shadow-primary/10">
        <div className="flex items-center gap-4 mb-6 ml-12 md:ml-0">
           <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/20">
             <Link href="/citizen/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
           </Button>
           <h1 className="text-xl font-bold">Rewards & Impact</h1>
        </div>
        
        <div className="flex flex-col items-center">
           <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white/30 bg-white/20 p-1">
                 <img 
                   src={`https://picsum.photos/seed/${user?.uid || 'user'}/200/200`} 
                   className="h-full w-full rounded-full object-cover" 
                   alt="User" 
                 />
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg border-2 border-white">
                 <Crown className="h-5 w-5" />
              </div>
           </div>
           <h2 className="mt-4 text-2xl font-bold">{currentPoints} <span className="text-sm font-normal opacity-80 uppercase tracking-widest">Points</span></h2>
           <p className="text-sm opacity-80">Rank: Eco Champion • Ward {profileData?.wardId || 'N/A'}</p>
        </div>
      </header>

      <main className="container max-w-lg space-y-6 px-4 py-6 mx-auto">
        {/* Next Reward Progress */}
        <Card className="border-none shadow-sm -mt-12 mx-2">
           <CardContent className="p-6">
              <div className="flex justify-between mb-2">
                 <h3 className="font-bold">Next Milestone</h3>
                 <span className="text-primary font-bold">{pointsLeft} pts left</span>
              </div>
              <Progress value={progressPercent} className="h-2 mb-3" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                 <Gift className="h-4 w-4 text-secondary" />
                 Reach {nextMilestone} points for an Eco-Voucher
              </div>
           </CardContent>
        </Card>

        {/* Badges */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-muted-foreground px-1">Badges Earned</h3>
          <div className="grid grid-cols-4 gap-4">
             <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                   <Medal className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold text-center">EARLY JOINER</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border", currentPoints > 100 ? "bg-secondary/10 text-secondary-foreground border-secondary/20" : "bg-muted/30 text-muted-foreground border-transparent opacity-30 grayscale")}>
                   <Star className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold text-center">TOP RECYCLER</span>
             </div>
             <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                <div className="h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                   <Trophy className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold text-center">COMMUNITY LEADER</span>
             </div>
             <div className="flex flex-col items-center gap-2 opacity-30 grayscale">
                <div className="h-14 w-14 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground">
                   <Crown className="h-8 w-8" />
                </div>
                <span className="text-[10px] font-bold text-center">LEGENDARY</span>
             </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase text-muted-foreground px-1">Leaderboard (Ward {profileData?.wardId})</h3>
          <Card className="border-none shadow-sm overflow-hidden">
             <CardContent className="p-0">
                {LEADERBOARD.map((item, idx) => (
                  <div key={item.name} className={cn("flex items-center justify-between p-4", idx !== LEADERBOARD.length - 1 && 'border-b')}>
                    <div className="flex items-center gap-4">
                       <span className={cn("text-lg font-bold w-6", idx === 0 ? 'text-secondary' : 'text-muted-foreground')}>{idx + 1}</span>
                       <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                          <img src={`https://picsum.photos/seed/${item.name}/100/100`} alt={item.name} />
                       </div>
                       <div>
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">{item.badge}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-primary">{item.points}</p>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold">PTS</p>
                    </div>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
