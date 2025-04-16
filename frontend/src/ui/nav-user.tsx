"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  CircleUser,
  Settings,
  Wallet,
  Shield,
  HelpCircle
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "@/services/admin"
import { Badge } from "@/components/ui/badge"

export function NavUser({ user, onLogout }: {
  user: User | any, onLogout: () => void;
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-9 w-9 rounded-lg border-2 border-primary/20">
                  <AvatarImage src={user?.avatar} alt={user.userId}/>
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    <CircleUser className="h-5 w-5"/>
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-medium">{user.userId}</span>
                    {user.isVerified && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground truncate block">
                    {user.userRole}
                  </span>
                </div>
                <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-64 rounded-xl shadow-lg border"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
            collisionPadding={16}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-4">
                <Avatar className="h-11 w-11 rounded-lg border-2 border-primary/20">
                  <AvatarImage src={user.avatar} alt={user.userId} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    <CircleUser className="h-5 w-5"/>
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate">{user.userId}</span>
                    {user.isVerified && (
                      <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                        <BadgeCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground truncate block">
                    {user.email || user.walletAddress}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="my-1" />

            {/* <DropdownMenuGroup>
              <DropdownMenuItem className="px-3 py-2.5 gap-2 cursor-pointer hover:bg-accent">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2.5 gap-2 cursor-pointer hover:bg-accent">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span>Wallet</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="px-3 py-2.5 gap-2 cursor-pointer hover:bg-accent">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Security</span>
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
{/* 
            <DropdownMenuSeparator className="my-1" />

            <DropdownMenuGroup>
              <DropdownMenuItem className="px-3 py-2.5 gap-2 cursor-pointer hover:bg-accent">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup> */}

            {/* <DropdownMenuSeparator className="my-1" /> */}

            <DropdownMenuItem 
              onClick={onLogout}
              className="px-3 py-2.5 gap-2 cursor-pointer text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}