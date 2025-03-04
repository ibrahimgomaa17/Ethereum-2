import { Outlet, NavLink } from "react-router-dom";
import SideMenu from "../components/SideMenu";
interface HeaderProps {
  token: string | null;
  user: any;
  onLogout: () => void;
}


const Dashboard = ({ token, user, onLogout }: HeaderProps)  => {
  return (
      <>
      <SideMenu  token={token} user={user} onLogout={onLogout} />
      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet /> {/* This renders the selected admin page */}
      </main>
      </>
  );
};

export default Dashboard;
