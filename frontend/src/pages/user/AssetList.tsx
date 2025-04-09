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

interface AssetManagementProps {
  user: User;
}

function AssetList({ user }: AssetManagementProps) {
  const { fetchUserAssets, recallPreviouslyOwnedAssets } = useUser();
  const [currentAssets, setCurrentAssets] = useState<Asset[]>([]);
  const [previousAssets, setPreviousAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const searchQuery = (term: string) => setSearch(term);

  const loadAssets = async () => {
    if (!user?.walletAddress) return;
    setLoading(true);
    const { currentAssets, previouslyOwnedAssets } = await fetchUserAssets(user.walletAddress);
debugger
    const filterAssets = (assets: Asset[]) =>
      assets.filter(asset =>
        JSON.stringify(asset).toLowerCase().includes(search.toLowerCase())
      );

    setCurrentAssets(filterAssets(currentAssets));
    setPreviousAssets(filterAssets(previouslyOwnedAssets));
    setLoading(false);
  };

  useEffect(() => {
    loadAssets();
  }, [user.walletAddress, search]);

  const handleTransferClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setTransferOpen(true);
  };

  const handleRecallAssets = async () => {
    if (!user?.walletAddress) return;

    const { message, error } = await recallPreviouslyOwnedAssets(user.walletAddress);
    if (message) {
      toast.success(message);
      await loadAssets();
    } else {
      toast.error(error || "Failed to recall assets.");
    }
  };

  const renderAssetTable = (
    assets: Asset[],
    title: string,
    isCurrent: boolean = true
  ) => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {!isCurrent && assets.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleRecallAssets}
          >
            Recall Assets
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Owner Address</TableHead>
            <TableHead>Transferred by Admin</TableHead>
            <TableHead>Last Modification</TableHead>
            {isCurrent && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map(asset => (
            <TableRow key={asset.uniqueId} className="group">
              <TableCell>{asset.uniqueId}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.propertyType}</TableCell>
              <TableCell>{asset.serialNumber}</TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>{asset.currentOwner}</TableCell>
              <TableCell className="text-center">
                {asset.transferredByAdmin ? 'Yes' : 'No'}
              </TableCell>
              <TableCell>{new Date(asset.lastTransferTime).toLocaleString()}</TableCell>
              {isCurrent && (
                <TableCell className="flex gap-2">
                  <Button size="sm" className="text-[.8rem]">History</Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-[.8rem]"
                    onClick={() => handleTransferClick(asset.uniqueId)}
                  >
                    Transfer
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <TransferAssetDrawer
        user={user}
        assetId={selectedAssetId!}
        open={transferOpen}
        setOpen={setTransferOpen}
        onTransferComplete={loadAssets}
      />

      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-row w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">User Section</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>My Assets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-row w-full justify-end">
          <SearchForm searchQuery={searchQuery} className="sm:ml-auto sm:w-auto" />
        </div>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          <div className="p-4 overflow-x-scroll block pb-4">
            {loading ? (
              <div>Loading assets...</div>
            ) : (
              <>
                {currentAssets.length > 0 &&
                  renderAssetTable(currentAssets, 'Current Assets', true)}
                {previousAssets.length > 0 &&
                  renderAssetTable(previousAssets, 'Previously Owned Assets', false)}
                {currentAssets.length === 0 && previousAssets.length === 0 && (
                  <div className="text-muted-foreground text-sm text-center">No assets found.</div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AssetList;
