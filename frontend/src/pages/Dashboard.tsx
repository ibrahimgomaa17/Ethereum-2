import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { User } from "@/services/admin";
import AppSidebar from "@/ui/app-sidebar";
import { Outlet, NavLink } from "react-router-dom";
interface HeaderProps {
  token: string | null;
  user: User;
  onLogout: () => void;
}
const adminLinks = [
  {
      title: "Admin Management",
      url: "admin",
      items: [
          {
              title: "Dashboard",
              url: "admin", //   Set Dashboard to "admin"
          },
          {
              title: "Actions",
              url: "admin/actions",
          },
          {
            title: "Lookup",
            url: "admin/finder",
        },
      ],
  },
]
const userLinks = [
  {
      title: "User Management",
      url: "user",
      items: [
          {
              title: "Dashboard",
              url: "user", //   Set Dashboard to "admin"
          },
          {
              title: "Assets",
              url: "user/assets",
          },
      ],
  },
]



const Dashboard = ({ token, user, onLogout }: HeaderProps) => {
  return (
    <SidebarProvider>
      <AppSidebar user={user} onLogout={onLogout} navLinks={user.userRole == 'Admin'? adminLinks:userLinks} />
      <SidebarInset className="w-[calc(100%-18rem)]">
        <Outlet /> {/* This renders the selected admin page */}
      </SidebarInset>
    </SidebarProvider>


  );
};

export default Dashboard;
