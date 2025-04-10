import { useState } from "react";
import { useAdmin } from "@/services/admin";
import { User, Asset } from "@/services/admin";

// UI components...
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

const Finder = () => {
  const { lookupEntityById } = useAdmin();
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const { user, assets } = await lookupEntityById(query);
      setUser(user);
      setAssets(assets || []);
    } catch (err) {
      console.error("❌ Lookup failed:", err);
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
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-row w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Admin Actions</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Lookup</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex w-full flex-row justify-end items-center gap-2">
          <Input
            className="w-full max-w-md"
            placeholder="Search by user ID or property ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </header>

      <div className="flex flex-col gap-4 p-6">
        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm md:col-span-1">
              <h2 className="text-xl font-semibold mb-2">User Info</h2>
              <div><strong>User ID:</strong> {user.userId}</div>
              <div><strong>Wallet:</strong> {user.walletAddress}</div>
              <div><strong>Role:</strong> {user.userRole}</div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-2">User Assets</h2>
              {assets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {assets.map((asset) => (
                    <div key={asset.uniqueId} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div><strong>Asset ID:</strong> {asset.uniqueId}</div>
                      <div><strong>Owner:</strong> {asset.currentOwner}</div>
                      <Button
                        size="sm"
                        className="mt-2 text-xs"
                        onClick={() => openHistory(asset.uniqueId)}
                      >
                        View History
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground mt-2">No assets found.</div>
              )}
            </div>
          </div>
        ) : assets.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Matching Property</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {assets.map((asset) => (
                <div key={asset.uniqueId} className="p-4 border rounded-lg bg-white shadow-sm">
                  <div><strong>Asset ID:</strong> {asset.uniqueId}</div>
                  <div><strong>Owner:</strong> {asset.currentOwner}</div>
                  <Button
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => openHistory(asset.uniqueId)}
                  >
                    View History
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : query.length > 0 && !loading ? (
          <div className="text-center text-muted-foreground mt-8">
            No user or asset found with that ID.
          </div>
        ) : null}
      </div>

      {/* 🧾 History Drawer */}
      <AssetHistoryDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        assetId={selectedAssetId}
      />
    </>
  );
};

export default Finder;
