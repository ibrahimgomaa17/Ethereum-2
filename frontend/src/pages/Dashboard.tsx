import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/ui/app-sidebar";
import { Outlet, NavLink } from "react-router-dom";
interface HeaderProps {
  token: string | null;
  user: any;
  onLogout: () => void;
}


const Dashboard = ({ token, user, onLogout }: HeaderProps) => {
  return (
    <SidebarProvider>
      <AppSidebar user={user} onLogout={onLogout} />
      <SidebarInset>
        <Outlet /> {/* This renders the selected admin page */}
      </SidebarInset>
    </SidebarProvider>


  );
};

export default Dashboard;
