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
import { GalleryVerticalEnd, ChevronDown, ChevronRight } from "lucide-react";
import { NavUser } from "./nav-user";
import { User } from "@/services/admin";
import { cn } from "@/lib/utils";

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

  return (
    <Sidebar className={cn("border-r border-gray-200 bg-white/95 backdrop-blur-sm", className)}>
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
      <SidebarContent className="px-2 py-4">
        {navLinks.map((group) => (
          <SidebarGroup key={group.title} className="mb-2">
            <SidebarGroupLabel 
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => toggleGroup(group.title)}
            >
              <span>{group.title}</span>
              {expandedGroups[group.title] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </SidebarGroupLabel>
            
            <SidebarGroupContent className={cn(
              "overflow-hidden transition-all duration-300",
              expandedGroups[group.title] ? "max-h-96" : "max-h-0"
            )}>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive =
                    location.pathname === `/${item.url}` ||
                    (item.url === "admin" && location.pathname === "/admin/");

                  return (
                    <SidebarMenuItem key={item.title} className="px-1">
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={cn(
                          "px-3 py-2 rounded-lg transition-colors",
                          isActive 
                            ? "bg-purple-50 text-purple-600 font-medium" 
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <NavLink to={`/${item.url}`} className="flex items-center gap-3">
                          {item.icon && (
                            <div className={cn(
                              "flex aspect-square size-8 items-center justify-center rounded-md",
                              isActive 
                                ? "bg-purple-100 text-purple-600" 
                                : "bg-gray-100 text-gray-500"
                            )}>
                              <item.icon className="size-4" />
                            </div>
                          )}
                          <span>{item.title}</span>
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
      <SidebarFooter className="border-t border-gray-100 px-4 py-4">
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;