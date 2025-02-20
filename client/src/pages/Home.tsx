
import { useState } from "react";

const Home = () => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", search);
  };

  return (
    <div>
      <h1>Blockchain Asset Search</h1>
      <input
        type="text"
        placeholder="Enter asset ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Home;
