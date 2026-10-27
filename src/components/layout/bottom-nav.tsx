"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trash2, Trophy, Map, User, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: any
}

export function BottomNav({ role }: { role: 'citizen' | 'worker' }) {
  const pathname = usePathname()

  const citizenItems: NavItem[] = [
    { label: 'Home', href: '/citizen/dashboard', icon: Home },
    { label: 'Smart Bins', href: '/citizen/bins', icon: Trash2 },
    { label: 'Waste Map', href: '/citizen/map', icon: Map },
    { label: 'Rewards', href: '/citizen/rewards', icon: Trophy },
    { label: 'Profile', href: '/citizen/profile', icon: User },
  ]

  const workerItems: NavItem[] = [
    { label: 'Home', href: '/worker/dashboard', icon: Home },
    { label: 'Tasks', href: '/worker/tasks', icon: ClipboardList },
    { label: 'Smart Bins', href: '/worker/bins', icon: Trash2 },
    { label: 'Route Map', href: '/worker/route', icon: Map },
    { label: 'Profile', href: '/worker/profile', icon: User },
  ]

  const items = role === 'citizen' ? citizenItems : workerItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t bg-white/80 pb-6 pt-3 backdrop-blur-md md:pb-3">
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
            )}
          >
            <item.icon className={cn("h-6 w-6", isActive && "stroke-[2.5px]")} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}