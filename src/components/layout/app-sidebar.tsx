
"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  Trash2,
  Trophy,
  Map,
  User,
  ClipboardList,
  Leaf,
  LogOut,
  Settings,
  Search,
  Users,
  BarChart3,
  Bell,
  LayoutDashboard,
  ShieldAlert,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { doc } from "firebase/firestore"

interface NavItem {
  label: string
  href: string
  icon: any
}

export function AppSidebar({ role }: { role: 'citizen' | 'worker' | 'admin' }) {
  const pathname = usePathname()
  const { user } = useUser()
  const db = useFirestore()

  const profilePath = role === 'citizen' 
    ? 'citizenProfile' 
    : role === 'worker' 
      ? 'workerProfile' 
      : 'adminProfile'

  const profileRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null
    return doc(db, "users", user.uid, profilePath, "profile")
  }, [db, user?.uid, profilePath])

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileRef)

  const citizenItems: NavItem[] = [
    { label: 'Dashboard', href: '/citizen/dashboard', icon: Home },
    { label: 'Smart Bins', href: '/citizen/bins', icon: Trash2 },
    { label: 'Waste Map', href: '/citizen/map', icon: Map },
    { label: 'Rewards & Impact', href: '/citizen/rewards', icon: Trophy },
    { label: 'Disposal Guide', href: '/citizen/disposal', icon: Search },
    { label: 'About WasteIQ', href: '/citizen/about', icon: Info },
  ]

  const workerItems: NavItem[] = [
    { label: 'Duty Dashboard', href: '/worker/dashboard', icon: Home },
    { label: 'Assigned Tasks', href: '/worker/tasks', icon: ClipboardList },
    { label: 'Bin Monitoring', href: '/worker/bins', icon: Trash2 },
  ]

  const adminItems: NavItem[] = [
    { label: 'Admin Panel', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', href: '/admin/complaints', icon: ShieldAlert },
    { label: 'Sanitation Workers', href: '/admin/workers', icon: Users },
    { label: 'Citizen Base', href: '/admin/users', icon: User },
    { label: 'Smart Bins', href: '/admin/bins', icon: Trash2 },
    { label: 'City Map', href: '/admin/map', icon: Map },
    { label: 'Reports & Data', href: '/admin/reports', icon: BarChart3 },
  ]

  const items = role === 'citizen' ? citizenItems : role === 'worker' ? workerItems : adminItems

  const displayName = profileData?.fullName || profileData?.workerName || user?.email?.split('@')[0] || 'User'
  const displaySub = role === 'citizen' ? 'Eco Champion' : role === 'worker' ? `Worker ${profileData?.workerId || ''}` : 'Super Admin'

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-white shadow-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <Leaf className="h-6 w-6" />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-lg leading-none">WasteIQ</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">
                {role === 'admin' ? 'Admin Portal' : 'Smart Management'}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg group-data-[collapsible=icon]:hidden text-muted-foreground hover:text-primary" asChild title="Updates & Notifications">
             <Link href={role === 'citizen' ? '/citizen/notifications' : role === 'worker' ? '/worker/notifications' : '/admin/notifications'}>
                <Bell className="h-4 w-4" />
             </Link>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "h-12 rounded-xl transition-all",
                        isActive ? "bg-primary/10 text-primary font-bold shadow-sm" : "hover:bg-muted"
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 my-2" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">
            Personal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes('profile')}
                  tooltip="My Profile"
                  className={cn(
                    "h-12 rounded-xl",
                    pathname.includes('profile') ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
                  )}
                >
                  <Link href={role === 'citizen' ? '/citizen/profile' : role === 'worker' ? '/worker/profile' : '/admin/profile'}>
                    <User className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">My Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.includes('settings')}
                  tooltip="Settings"
                  className={cn(
                    "h-12 rounded-xl",
                    pathname.includes('settings') ? "bg-primary/10 text-primary font-bold" : "hover:bg-muted"
                  )}
                >
                  <Link href={role === 'citizen' ? '/citizen/settings' : role === 'worker' ? '/worker/settings' : '/admin/settings'}>
                    <Settings className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-muted/50 p-3 group-data-[collapsible=icon]:p-2 transition-all">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-white p-0.5 shadow-sm">
              <img 
                src={`https://picsum.photos/seed/${user?.uid || 'user'}/100/100`} 
                className="h-full w-full rounded-[10px] object-cover" 
                alt="Profile" 
              />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-bold truncate">
                {isProfileLoading ? "..." : displayName}
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase font-bold">
                {displaySub}
              </span>
            </div>
            <Link href="/" className="ml-auto group-data-[collapsible=icon]:hidden">
              <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
