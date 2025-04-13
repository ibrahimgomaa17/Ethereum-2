import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/ui/header";
import { useAdmin } from "@/services/admin";
import { Asset, User } from "@/services/admin";
import { Card } from "@/components/ui/card";

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
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      <Header token={token} user={user} onLogout={onLogout} />

      {/* Hero Section */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"> {/* Increased max-width */}
          <div className="relative z-10 py-16 md:py-24 lg:py-32"> {/* Simplified padding */}
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block">Blockchain Asset</span>
                <span className="block text-blue-200">Management Platform</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-200 sm:text-xl">
                Store and manage your assets securely on the blockchain using Proof of Authority.
              </p>
              
                {/* Search Section */}
                <div className="mt-12 flex flex-col items-center justify-center gap-4">
                <div className="flex w-full max-w-3xl rounded-lg shadow-lg overflow-hidden mx-auto gap-2">
                  <Input
                  placeholder="Search for Asset ID, Wallet Address, or User ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-6 py-4 text-lg bg-white border-0 focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg transition-colors"
                  >
                  {loading ? "Searching..." : "Search"}
                  </Button>
                </div>
                {error && <p className="text-red-200 text-sm mt-2">{error}</p>}
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-24 bg-gray-50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"> {/* Increased max-width */}
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Secure, transparent, and efficient asset management on the blockchain
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Proof of Authority",
                description: "Securely store assets on the blockchain with a trusted Proof of Authority mechanism.",
                icon: "🔐"
              },
              {
                title: "User & Asset Management",
                description: "Easily search and manage users and assets with our intuitive interface.",
                icon: "👥"
              },
              {
                title: "Transparent Transfers",
                description: "Track asset transfers with complete transparency and security.",
                icon: "🔄"
              }
            ].map((feature, index) => (
              <Card key={index} className="relative p-8 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full py-16 px-4 bg-white">
        {result && (
          <div className="mx-auto max-w-[1400px] space-y-8"> {/* Increased max-width */}
            {result.user && (
              <Card className="p-8 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">User Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">User ID</p>
                    <p className="text-base font-semibold">{result.user.userId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Wallet Address</p>
                    <p className="text-base font-mono">{result.user.walletAddress}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-base font-semibold">{result.user.userRole}</p>
                  </div>
                </div>
              </Card>
            )}
            {result.assets.length > 0 && (
              <Card className="p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Assets</h2>
                <div className="space-y-4">
                  {result.assets.map((asset) => (
                    <div
                      key={asset.uniqueId}
                      className="border border-gray-300 rounded-lg p-4 text-sm"
                    >
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
    </div>
  );
};

export default Home;
