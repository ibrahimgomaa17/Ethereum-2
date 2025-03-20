import { SearchForm } from "@/components/search-form";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useAdmin, Asset, User } from "@/services/admin";
import { Separator } from "@radix-ui/react-separator";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
interface AssetManagementProps {
  user: User; // Replace `any` with the appropriate type for `user` if available
}

function AssetList({ user }: AssetManagementProps) {
  const { fetchAssets } = useAdmin();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [create, setCreate] = useState('');

  const searchQuery = (term: string) => {
    setSearch(term);
  };

  const createAsset = (assetID: string) => {
    setCreate(assetID);
  };

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      const assetList: Asset[] = await fetchAssets();
      setAssets(assetList?.filter(asset => JSON.stringify(asset).toLowerCase().includes(search.toLowerCase())));
      setLoading(false);
    };

    loadAssets();
  }, [search, create]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-row w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Admin Section</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Assets</BreadcrumbPage>
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
          {/* <div className="p-4 overflow-x-scroll block  pb-4">
            {loading ? (
              <div>Loading assets...</div>
            ) : (

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
                    <TableHead>History</TableHead>
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
                      <TableCell className="text-center">{asset.transferredByAdmin ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{new Date(asset.lastTransferTime).toLocaleString()}</TableCell>
                      <TableCell className="opacity-0 group-hover:opacity-100 "><Button size='sm' className="text-[.8rem]">Asset History</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AssetList;
