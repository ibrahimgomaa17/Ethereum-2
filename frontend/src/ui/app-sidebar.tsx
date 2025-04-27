import * as React from "react";
import { useLocation, NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEnd,
  Gem,
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Shield,
} from "lucide-react";
import { NavUser } from "./nav-user";
import { User } from "@/services/admin";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface AppSidebarProps {
  user: User;
  onLogout: () => void;
  navLinks: NavGroup[];
  className?: string;
}

const DEFAULT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Dashboard: LayoutDashboard,
  Assets: Gem,
  Users: Users,
  Documents: FileText,
  Settings: Settings,
  Admin: Shield,
};

const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  onLogout,
  navLinks,
  className,
}) => {
  const location = useLocation();

  const getItemIcon = (item: NavItem) => {
    return item.icon || DEFAULT_ICONS[item.title] || Gem;
  };

  const isItemActive = (item: NavItem) => {
    return (
      location.pathname === `/${item.url}` ||
      (item.url === "admin" && location.pathname === "/admin/")
    );
  };

  return (
    <Sidebar
      className={cn(
        "border-r border-muted/20 bg-background/95 flex flex-col",
        "transition-all duration-300 ease-in-out w-[240px]",
        className
      )}
    >
      {/* Brand Header */}
      <SidebarHeader className="px-4 py-5 border-b border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-gray-50 rounded-lg transition-colors"
            >
              <NavLink to="#" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
                  <GalleryVerticalEnd className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-gray-900">Blockchain Portal</span>
                  <span className="text-xs text-gray-500">Asset Management</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-4 py-4 flex-1 overflow-y-auto">
        {navLinks.map((group) => (
          <div key={group.title} className="mb-6 last:mb-2">
            {/* Group header as small text */}
            {group.title && (
              <div className="px-3 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
                  {group.title}
                </span>
              </div>
            )}

            <SidebarMenu className="space-y-1">
              {group.items.map((item) => {
                const active = isItemActive(item);
                const Icon = getItemIcon(item);

                return (
                  <SidebarMenuItem key={`${group.title}-${item.title}`}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "px-3 py-2.5 rounded-lg transition-all duration-200 group",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                        active
                          ? "bg-primary/10 text-primary font-medium "
                          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                      )}
                    >
                      <NavLink
                        to={`/${item.url}`}
                        className="flex items-center gap-3 w-full"
                      >
                        <div
                          className={cn(
                            "flex aspect-square size-8 items-center justify-center rounded-lg transition-all",

                            active
                              ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-primary-foreground"
                              : "bg-accent/20 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}
                        >
                          <Icon className={cn(
                            "size-[16px] transition-colors",
                            active ? "text-primary-foreground" : "text-current"
                          )} />
                        </div>
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate text-sm">{item.title}</span>
                          {item.badge && (
                            <Badge
                              variant={item.badge.variant || "secondary"}
                              className="text-xs ml-2 shrink-0 px-1.5 py-0.5 font-medium"
                            >
                              {item.badge.text}
                            </Badge>
                          )}
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t border-muted/20 px-4 py-4 bg-muted/10">
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;