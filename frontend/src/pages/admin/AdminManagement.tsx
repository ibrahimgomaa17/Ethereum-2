import { SearchForm } from "@/components/search-form";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { useAdmin, Asset, User } from "@/services/admin";
import { Separator } from "@radix-ui/react-separator";
import { useState, useEffect } from "react";
import { CreateAssetDrawer } from "./CreateAssetDrawer";
import { Button } from "@/components/ui/button";
interface AdminManagementProps {
  user: User; // Replace `any` with the appropriate type for `user` if available
}

function AdminManagement({ user }: AdminManagementProps) {
  const { fetchAssets } = useAdmin();
  const [create, setCreate] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);


  const createAsset = (assetID: string) => {
    setCreate(assetID);
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
                <BreadcrumbPage>Assets</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        {/* <div className="flex flex-row w-full justify-end">
          <SearchForm searchQuery={searchQuery} className="sm:ml-auto sm:w-auto" />
          <CreateAssetDrawer createAsset={createAsset} user={user}></CreateAssetDrawer>

        </div> */}
      </header>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div className="flex flex-row flex-wrap max-w-xl w-full">
          <div className="flex flex-col items-stretch px-1 w-1/2 min-h-32" onClick={() => setOpenDrawer(true)}>
            <div className="flex flex-col justify-center items-center p-5 rounded bg-muted w-full h-full m-1 btn">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight select-none">
                Register Asset
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-stretch px-1 w-1/2 min-h-32">
            <div className="flex flex-col justify-center items-center p-5 rounded bg-muted w-full h-full m-1 btn">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight select-none">
                Transfer Ownership
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-stretch px-1 w-1/2 min-h-32">
            <div className="flex flex-col justify-center items-center p-5 rounded bg-muted w-full h-full m-1 btn">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight select-none">
               Make An Admin
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-stretch px-1 w-1/2 min-h-32">
            <div className="flex flex-col justify-center items-center p-5 rounded bg-muted w-full h-full m-1 btn">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight select-none">
               Remove An Admin
              </h3>
            </div>
          </div>
        </div>
      </div>
      <CreateAssetDrawer createAsset={createAsset} user={user} openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></CreateAssetDrawer>
    </>
  );
};

export default AdminManagement;
