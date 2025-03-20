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
import { GalleryVerticalEnd } from "lucide-react";
import { NavUser } from "./nav-user";

// Navigation Data

interface AppSidebarProps {
    user: any;
    onLogout: () => void;
    navLinks:any[]
}

const AppSidebar = ({ user, onLogout, navLinks }: AppSidebarProps) => {
    const location = useLocation(); // ✅ Get current URL path

    return (
        <Sidebar >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <NavLink to="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Documentation</span>
                                </div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {navLinks.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    // ✅ Ensure Dashboard is active for "/admin" and "/admin/"
                                    const isActive =
                                        location.pathname === `/${item.url}` ||
                                        (item.url === "admin" && location.pathname === "/admin/");

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <NavLink to={`/${item.url}`}>
                                                    {item.title}
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
            <SidebarFooter>
                <NavUser user={user} onLogout={onLogout} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}

export default AppSidebar;