import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { Asset, User } from "@/services/admin";
import { useUser } from "@/services/user";
import { Separator } from "@radix-ui/react-separator";
import { useState, useEffect } from "react";
import TransferAssetDrawer from "./TransferAssetDrawer";
import { toast } from "sonner";
import AssetHistoryDrawer from "../shared/AssetHistoryDrawer";
import { RecallAssetDrawer } from "./RecallAssetDrawer";
import { Badge } from "@/components/ui/badge";
import { Package, History, ArrowRight, RefreshCw, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AssetManagementProps {
  user: User;
}

function AssetList({ user }: AssetManagementProps) {
  const { fetchUserAssets } = useUser();
  const [currentAssets, setCurrentAssets] = useState<Asset[]>([]);
  const [previousAssets, setPreviousAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [transferOpen, setTransferOpen] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [recallOpen, setRecallOpen] = useState(false);
  const searchQuery = (term: string) => setSearch(term);

  const loadAssets = async () => {
    if (!user?.walletAddress) return;
    setLoading(true);
    try {
      const { currentAssets, previouslyOwnedAssets } = await fetchUserAssets(user.walletAddress);
      const filterAssets = (assets: Asset[]) =>
        assets.filter(asset =>
          JSON.stringify(asset).toLowerCase().includes(search.toLowerCase())
        );

      setCurrentAssets(filterAssets(currentAssets));
      setPreviousAssets(filterAssets(previouslyOwnedAssets));
    } catch (error) {
      toast.error("Failed to load assets", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [user.walletAddress, search]);

  const handleTransferClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setTransferOpen(true);
  };

  const handleHistoryClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setOpenDrawer(true);
  };

  const handleRecallAssets = () => {
    setRecallOpen(true);
  };

  const renderAssetTable = (
    assets: Asset[],
    title: string,
    isCurrent: boolean = true
  ) => (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="border-b p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {assets.length} {assets.length === 1 ? 'asset' : 'assets'} registered
              </p>
            </div>
          </div>
          {!isCurrent && assets.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRecallAssets}
              className="gap-1.5 shadow-sm"
            >
              <AlertTriangle className="h-4 w-4" />
              Recall Assets
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px] font-medium">Asset ID</TableHead>
                <TableHead className="font-medium">Name</TableHead>
                <TableHead className="font-medium">Type</TableHead>
                <TableHead className="font-medium">Serial #</TableHead>
                <TableHead className="font-medium">Location</TableHead>
                <TableHead className="font-medium">Owner</TableHead>
                <TableHead className="text-center font-medium">Admin Transfer</TableHead>
                <TableHead className="font-medium">Last Modified</TableHead>
                {isCurrent && <TableHead className="text-right font-medium">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map(asset => (
                <TableRow key={asset.uniqueId} className="group hover:bg-muted/50">
                  <TableCell className="font-medium font-mono text-sm">
                    <span className="bg-muted/50 px-2 py-1 rounded-md">
                      {asset.uniqueId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{asset.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {asset.propertyType}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {asset.serialNumber || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {asset.location || (
                      <span className="text-muted-foreground">Not specified</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    <span className="truncate max-w-[120px] inline-block">
                      {asset.currentOwner}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {asset.transferredByAdmin ? (
                      <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Yes
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(asset.lastTransferTime).toLocaleString()}
                  </TableCell>
                  {isCurrent && (
                    <TableCell className="flex justify-end gap-2">
                      <Button 
                        onClick={() => handleHistoryClick(asset.uniqueId)} 
                        size="sm" 
                        variant="outline"
                        className="gap-1.5 text-xs h-8 hover:bg-primary/10 hover:text-primary"
                      >
                        <History className="h-3.5 w-3.5" />
                        History
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.01]" 
                        onClick={() => handleTransferClick(asset.uniqueId)}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                        Transfer
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col h-full bg-muted/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                User Section
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">
                My Assets
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadAssets}
            className="gap-1.5 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <SearchForm 
            searchQuery={searchQuery} 
            className="w-[200px] lg:w-[300px] shadow-sm" 
            
          />
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-1/3 rounded-lg" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
          </div>
        ) : (
          <>
            {currentAssets.length > 0 &&
              renderAssetTable(currentAssets, 'Current Assets', true)}
            {previousAssets.length > 0 &&
              renderAssetTable(previousAssets, 'Previously Owned Assets', false)}
            {currentAssets.length === 0 && previousAssets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
                <div className="p-4 rounded-full bg-primary/10 mb-4">
                  <Package className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No assets found</h3>
                <p className="text-muted-foreground max-w-md">
                  {search 
                    ? 'No assets match your search criteria. Try adjusting your search terms.'
                    : 'This user currently has no assets registered in the system.'}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-6 gap-1.5 shadow-sm"
                  onClick={loadAssets}
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh Assets
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <TransferAssetDrawer
        user={user}
        assetId={selectedAssetId!}
        open={transferOpen}
        setOpen={setTransferOpen}
        onTransferComplete={loadAssets}
      />

      <AssetHistoryDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        assetId={selectedAssetId}
      />

      <RecallAssetDrawer
        open={recallOpen}
        user={user}
        setOpen={setRecallOpen}
        onTransferComplete={loadAssets}
      />
    </div>
  );
}

export default AssetList;