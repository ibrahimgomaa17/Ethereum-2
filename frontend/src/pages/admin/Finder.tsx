import { useState } from "react";
import { useAdmin } from "@/services/admin";
import { User, Asset } from "@/services/admin";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import AssetHistoryDrawer from "../shared/AssetHistoryDrawer";
import { Card } from "@/components/ui/card";
import { SearchIcon, UserIcon, PackageIcon, HistoryIcon, ClipboardCopyIcon, CheckIcon, EditIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_BASE_URL + '/public';

const Finder = () => {
  const { lookupEntityById } = useAdmin();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`, {
      icon: <CheckIcon className="h-4 w-4 text-green-500" />,
    });
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const { user, assets } = await lookupEntityById(query);
      setUser(user);
      setAssets(assets || []);
    } catch (err) {
      console.error("Lookup failed:", err);
      setUser(null);
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  const openHistory = (assetId: string) => {
    setSelectedAssetId(assetId);
    setOpenDrawer(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white/95 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Admin Console
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium text-gray-900">
                Asset Finder
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Search Bar */}
        <div className="ml-auto flex w-full max-w-md items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-9 pr-4 py-2"
              placeholder="Search by user ID, wallet, or asset ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.01]"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-64 md:col-span-1" />
              <Skeleton className="h-64 md:col-span-2" />
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col md:flex-row gap-6 relative">
            {/* User Profile Card - Sticky */}
            <div className="md:w-1/4 md:sticky md:top-20 md:self-start md:h-[calc(100vh-3rem)] md:overflow-y-auto">
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-50/50">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md border border-blue-100">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">User Profile</h2>
                      <Badge
                        variant="outline"
                        className="mt-1 bg-blue-100 text-blue-600 border-blue-200 text-xs font-medium"
                      >
                        {user.userRole}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-white/80 rounded-lg border border-blue-100 shadow-xs">
                      <p className="text-xs font-medium text-blue-500 mb-1">User ID</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm break-all text-gray-800">{user.userId}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-blue-400 hover:text-blue-600"
                          onClick={() => copyToClipboard(user.userId, 'User ID')}
                        >
                          <ClipboardCopyIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-3 bg-white/80 rounded-lg border border-blue-100 shadow-xs">
                      <p className="text-xs font-medium text-blue-500 mb-1">Wallet Address</p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm break-all text-gray-800">{user.walletAddress}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-blue-400 hover:text-blue-600"
                          onClick={() => copyToClipboard(user.walletAddress, 'Wallet Address')}
                        >
                          <ClipboardCopyIcon className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* User Assets - Scrollable */}
            <div className="md:w-3/4 pb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <PackageIcon className="h-5 w-5 text-gray-500" />
                  User Assets
                </h2>
                <p className="text-sm text-gray-500">
                  {assets.length} {assets.length === 1 ? 'asset' : 'assets'} found
                </p>
              </div>

              {assets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {assets.map((asset) => (
                    <Card 
                      key={asset.uniqueId}
                      className="group relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
                    >
                      {/* Image section */}
                      {asset.imageUrl && (
                        <div className="relative h-40 overflow-hidden">
                          <img
                            src={`${BASE_URL}${asset.imageUrl}`}
                            alt={asset.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=No+Image';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                        </div>
                      )}
                    
                      <div className="p-5">
                        {/* Asset header */}
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
                                {asset.propertyType}
                              </Badge>
                              {asset.transferredByAdmin && (
                                <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                  Admin Transfer
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                            #{asset.serialNumber}
                          </div>
                        </div>
                    
                        {/* Asset details grid */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <div>
                            <p className="text-xs font-medium text-gray-500">Asset ID</p>
                            <div className="flex items-center mt-1">
                              <p className="font-mono text-sm break-all text-gray-800">{asset.uniqueId}</p>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 ml-1 text-gray-400 hover:text-gray-600"
                                onClick={() => copyToClipboard(asset.uniqueId, 'Asset ID')}
                              >
                                <ClipboardCopyIcon className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                    
                          <div>
                            <p className="text-xs font-medium text-gray-500">Current Owner</p>
                            <div className="flex items-center mt-1">
                              <p className="font-mono text-sm break-all text-gray-800">{asset.currentOwner}</p>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-5 w-5 ml-1 text-gray-400 hover:text-gray-600"
                                onClick={() => copyToClipboard(asset.currentOwner, 'Owner Address')}
                              >
                                <ClipboardCopyIcon className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                    
                          <div>
                            <p className="text-xs font-medium text-gray-500">Location</p>
                            <p className="text-sm text-gray-800 mt-1">{asset.location || 'Not specified'}</p>
                          </div>
                    
                          <div>
                            <p className="text-xs font-medium text-gray-500">Last Transfer</p>
                            <p className="text-sm text-gray-800 mt-1">
                              {new Date(asset.lastTransferTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                    
                        {/* Action buttons */}
                        <div className="mt-5 flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-1.5 text-xs border-gray-200 hover:border-indigo-200 hover:text-indigo-600"
                            onClick={() => openHistory(asset.uniqueId)}
                          >
                            <HistoryIcon className="h-3.5 w-3.5" />
                            View History
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">No assets found for this user</p>
                </Card>
              )}
            </div>
          </div>
        ) : assets.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <PackageIcon className="h-5 w-5 text-gray-500" />
                Matching Assets
              </h2>
              <p className="text-sm text-gray-500">
                {assets.length} {assets.length === 1 ? 'asset' : 'assets'} found
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <Card key={asset.uniqueId} className="hover:shadow-md transition-shadow">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium font-mono text-sm break-all">
                        {asset.uniqueId}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {asset.propertyType}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Current Owner</p>
                        <p className="font-mono text-xs break-all">{asset.currentOwner}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Last Transfer</p>
                        <p className="text-xs">
                          {new Date(asset.lastTransferTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 gap-1.5 text-xs"
                      onClick={() => openHistory(asset.uniqueId)}
                    >
                      <HistoryIcon className="h-3.5 w-3.5" />
                      View History
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : query.length > 0 && !loading ? (
          <Card className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
              <SearchIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No results found</h3>
            <p className="text-gray-500">
              No user or asset found matching "{query}"
            </p>
            <Button variant="ghost" size="sm" className="mt-4">
              Try a different search
            </Button>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="max-w-md text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <SearchIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Asset Finder</h3>
              <p className="text-gray-500">
                Search for users or assets by ID, wallet address, or asset number
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Asset History Drawer */}
      <AssetHistoryDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        assetId={selectedAssetId}
      />
    </div>
  );
};

export default Finder;