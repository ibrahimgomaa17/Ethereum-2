import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/ui/header";
import { useAdmin } from "@/services/admin";
import { Asset, User } from "@/services/admin";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface HeaderProps {
  token?: string | any;
  user?: User | any;
  onLogout?: () => void;
}

const Home = ({ token, user, onLogout }: HeaderProps) => {
  const { lookupEntityById } = useAdmin();
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<{ user: User | null; assets: Asset[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    if (!search.trim()) {
      setError("Please enter a valid search query.");
      setLoading(false);
      return;
    }

    try {
      const response = await lookupEntityById(search.trim());
      if (!response.user && response.assets.length === 0) {
        setError("No results found.");
      } else {
        setResult(response);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong during the search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header token={token} user={user} onLogout={onLogout} />

      <div className="flex flex-col items-center justify-center min-h-[40rem] px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Search Users or Assets</h1>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            placeholder="Enter Asset ID, Wallet Address, or User ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4">{error}</p>
        )}

        {result && (
          <div className="w-full max-w-2xl mt-8 space-y-6">
            {result.user && (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-2">User Info</h2>
                <div className="text-sm space-y-1">
                  <p><strong>User ID:</strong> {result.user.userId}</p>
                  <p><strong>Wallet Address:</strong> {result.user.walletAddress}</p>
                  <p><strong>Role:</strong> {result.user.userRole}</p>
                </div>
              </Card>
            )}

            {result.assets.length > 0 && (
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-2">Assets</h2>
                <div className="space-y-3">
                  {result.assets.map((asset) => (
                    <div key={asset.uniqueId} className="border border-muted rounded-lg p-3 text-sm">
                      <p><strong>ID:</strong> {asset.uniqueId}</p>
                      <p><strong>Name:</strong> {asset.name}</p>
                      <p><strong>Type:</strong> {asset.propertyType}</p>
                      <p><strong>Owner:</strong> {asset.currentOwner}</p>
                      <p><strong>Transferred by Admin:</strong> {asset.transferredByAdmin ? "Yes" : "No"}</p>
                      <p><strong>Last Transfer:</strong> {new Date(asset.lastTransferTime).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
