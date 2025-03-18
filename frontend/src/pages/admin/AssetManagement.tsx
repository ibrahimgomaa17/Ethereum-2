import { SearchForm } from "@/components/search-form";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, Drawer } from "@/components/ui/drawer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useAdmin, Asset } from "@/services/admin";
import { Separator } from "@radix-ui/react-separator";
import { useState, useEffect } from "react";

const AssetManagement = () => {
  const { fetchAssets } = useAdmin();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const searchQuery = (term: string) => {
    setSearch(term);
  };

  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      const assetList: Asset[] = await fetchAssets();
      setAssets(assetList?.filter(asset => asset.name.toLowerCase().includes(search.toLowerCase())));
      setLoading(false);
    };

    loadAssets();
  }, [search]);

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
          <Drawer  direction="right">
            <DrawerTrigger>Open</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                    <Button>Submit</Button>
                    <DrawerClose>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
        </div>
      </header>

      <div className="p-4 overflow-x-scroll block ">
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
                <TableHead>Last Transfer Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map(asset => (
                <TableRow key={asset.uniqueId}>
                  <TableCell>{asset.uniqueId}</TableCell>
                  <TableCell>{asset.name}</TableCell>
                  <TableCell>{asset.propertyType}</TableCell>
                  <TableCell>{asset.serialNumber}</TableCell>
                  <TableCell>{asset.location}</TableCell>
                  <TableCell>{asset.currentOwner}</TableCell>
                  <TableCell className="text-center">{asset.transferredByAdmin ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{new Date(asset.lastTransferTime).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default AssetManagement;
