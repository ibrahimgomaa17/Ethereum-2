import * as React from "react";
import { useLocation, NavLink } from "react-router-dom";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd, ChevronDown, ChevronRight, Gem, LayoutDashboard, Users, Settings, FileText, Shield } from "lucide-react";
import { NavUser } from "./nav-user";
import { User } from "@/services/admin";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AppSidebarProps {
  user: User;
  onLogout: () => void;
  navLinks: any[];
  className?: string;
}

const AppSidebar = ({ user, onLogout, navLinks, className }: AppSidebarProps) => {
  const location = useLocation();
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }));
  };

  // Default icons for common menu items
  const getDefaultIcon = (title: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Dashboard': LayoutDashboard,
      'Assets': Gem,
      'Users': Users,
      'Documents': FileText,
      'Settings': Settings,
      'Admin': Shield
    };
    return iconMap[title] || Gem;
  };

  return (
    <Sidebar className={cn("border-r border-muted bg-background/95 backdrop-blur-sm", className)}>
      {/* Brand Header */}
      <SidebarHeader className="px-6 py-5 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="hover:bg-accent rounded-lg transition-colors p-0"
            >
              <NavLink to="#" className="flex items-center gap-3 w-full">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                  <GalleryVerticalEnd className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-bold text-lg">AssetChain</span>
                  <span className="text-xs text-muted-foreground">v2.4.0</span>
                </div>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="px-3 py-4">
        {navLinks.map((group) => (
          <SidebarGroup key={group.title} className="mb-1">
            <SidebarGroupLabel 
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors",
                "text-muted-foreground hover:text-foreground hover:bg-accent",
                expandedGroups[group.title] ? "bg-accent text-foreground" : ""
              )}
              onClick={() => toggleGroup(group.title)}
            >
              <div className="flex items-center gap-2">
                {group.icon && (
                  <group.icon className="h-4 w-4" />
                )}
                <span>{group.title}</span>
              </div>
              {expandedGroups[group.title] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </SidebarGroupLabel>
            
            <SidebarGroupContent className={cn(
              "overflow-hidden transition-all duration-200",
              expandedGroups[group.title] ? "max-h-96 py-1" : "max-h-0"
            )}>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === `/${item.url}` ||
                    (item.url === "admin" && location.pathname === "/admin/");
                  const IconComponent = item.icon || getDefaultIcon(item.title);

                  return (
                    <SidebarMenuItem key={item.title} className="px-1">
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "px-3 py-2.5 rounded-lg transition-colors group",
                          isActive 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <NavLink to={`/${item.url}`} className="flex items-center gap-3">
                          <div className={cn(
                            "flex aspect-square size-8 items-center justify-center rounded-md transition-colors",
                            isActive 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-accent text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            <IconComponent className="size-4" />
                          </div>
                          <div className="flex items-center justify-between flex-1">
                            <span>{item.title}</span>
                            {item.badge && (
                              <Badge variant={item.badge.variant} className="text-xs">
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
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* User Footer */}
      <SidebarFooter className="border-t px-4 py-4 bg-muted/20">
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;