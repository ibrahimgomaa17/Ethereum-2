import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Header } from "@/ui/header";
import { useAdmin, User } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CopyIcon, ArrowLeftIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  token?: string | any;
  user?: User | any;
  onLogout?: () => void;
}

const BASE_URL = import.meta.env.VITE_BASE_URL + '/public';

const SearchResults = ({ token, user, onLogout }: HeaderProps) => {
  const location = useLocation();
  let { result } = location.state || { result: null };
  const [copied, setCopied] = useState(false);

  const { lookupEntityById } = useAdmin();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError("");

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
        result = response;
        navigate("/search-results", { state: { result: response } });
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong during the search.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br  pt-20">
        <Header token={token} user={user} onLogout={onLogout} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center p-8 max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 mb-4">
              <svg
                className="h-8 w-8 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">No results found</h3>
            <p className="mt-2 text-gray-600">
              Your search didn't return any results. Try a different query.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02]"
              >
                <ArrowLeftIcon className="mr-2 h-5 w-5" />
                Back to search
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br pt-20">
      <Header token={token} user={user} onLogout={onLogout} />
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Enhanced Search Bar */}
        <div className="mb-10">
          <div className="relative flex items-center max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <Input
              placeholder="Search for Asset ID, Wallet Address, or User ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 pl-6 pr-12 py-5 text-base border-0 focus:ring-0 focus:ring-offset-0"
            />
            <Button
              onClick={handleSearch}
              className="absolute right-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md"
            >
              {window.innerWidth > 640 ? "Search" : "🔍"}
            </Button>
          </div>
        </div>

        {/* Results Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Profile Section */}
          {result.user && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 mr-3">
                    <svg
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  User Profile
                </h2>
                <Badge variant="outline" className="text-purple-600 border-purple-300">
                  {result.user.userRole}
                </Badge>
              </div>
              
              <Card className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">User ID</p>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-mono text-gray-900 break-all">{result.user.userId}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Wallet Address</p>
                      <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                        <p className="font-mono text-gray-900 truncate">{result.user.walletAddress}</p>
                        <button
                          onClick={() => handleCopy(result.user.walletAddress)}
                          className="ml-2 text-gray-400 hover:text-purple-600 transition-colors p-1"
                          aria-label="Copy Wallet Address"
                          title="Copy to clipboard"
                        >
                          <CopyIcon className="h-4 w-4" />
                        </button>
                      </div>
                      {copied && (
                        <div className="text-xs text-green-600 mt-1 animate-fade-in-out">
                          Copied to clipboard!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Assets Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-blue-100 mr-3">
                  <svg
                    className="h-5 w-5 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                Assets
              </h2>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-600">
                {result.assets.length} items
              </Badge>
            </div>
            
            {result.assets.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {result.assets.map((asset) => (
                  <Card
                    key={asset.uniqueId}
                    className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="flex-shrink-0 relative">
                        <div className="w-full sm:w-40 h-40 rounded-lg overflow-hidden">
                          <img
                            src={`${BASE_URL}${asset.imageUrl}`}
                            alt={asset.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/160?text=No+Image';
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {asset.name}
                          </h3>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
                            {asset.propertyType}
                          </Badge>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Asset ID</p>
                            <div className="p-2 bg-gray-50 rounded-md">
                              <p className="font-mono text-sm text-gray-900 truncate">{asset.uniqueId}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Owner</p>
                            <div className="p-2 bg-gray-50 rounded-md flex items-center justify-between">
                              <p className="font-mono text-sm text-gray-900 truncate">
                                {asset.currentOwner}
                              </p>
                              <button
                                onClick={() => handleCopy(asset.currentOwner)}
                                className="text-gray-400 hover:text-indigo-600 p-1"
                                title="Copy address"
                              >
                                <CopyIcon className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Last Transfer</p>
                            <p className="text-sm text-gray-900 p-2">
                              {new Date(asset.lastTransferTime).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Admin Transfer</p>
                            <p className="text-sm p-2">
                              {asset.transferredByAdmin ? (
                                <span className="text-green-600 font-medium">Yes</span>
                              ) : (
                                <span className="text-gray-500">No</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 mb-4">
                  <svg
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No assets found</h3>
                <p className="mt-2 text-gray-600">
                  This user doesn't have any assets associated with them.
                </p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to previous page
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SearchResults;