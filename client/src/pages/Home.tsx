import { Button } from "@mui/joy";
import Input from "@mui/joy/Input";
import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import Header from "../components/Header";

interface HeaderProps {
  token: string | null;
  user: any;
  onLogout: () => void;
}


const Home = ({ token, user, onLogout }: HeaderProps)  => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", search);
  };

  return (
    <>
      <Header token={token} user={user} onLogout={onLogout} />
      <div className="flex flex-col items-center justify-center h-full min-h-[40rem]">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">
          Asset Search
        </h1>

        <Input
          placeholder="Search for assets"
          startDecorator={<SearchIcon />}
          endDecorator={<Button>Search</Button>}
          sx={{
            "--Input-radius": "30px",
            "--Input-gap": "10px",
            width: 500,
            "--Input-minHeight": "56px",
            "--Input-paddingInline": "16px",
            "--Input-decoratorChildHeight": "42px"
          }}
        ></Input>

      </div>
    </>
  );
};

export default Home;
