import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/ui/header";
import { GalleryVerticalEnd } from "lucide-react";
import { useState } from "react";


interface HeaderProps {
  token?: string | any;
  user?: any;
  onLogout?: () => void;
}


const Home = ({ token, user, onLogout }: HeaderProps) => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", search);
  };

  return (
    <>
        <Header token={token} user={user} onLogout={onLogout}></Header>

      <div className="flex flex-col items-center justify-center h-full min-h-[40rem]">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Asset Search
        </h1>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input className="min-w-80" type="email" placeholder="Email" />
          <Button type="submit">Search</Button>
        </div>


      </div>
    </>
  );
};

export default Home;
