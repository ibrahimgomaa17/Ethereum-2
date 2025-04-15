import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdmin, Asset, User } from "@/services/admin";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { CreateAssetDrawer } from "./CreateAssetDrawer";
import { TransferAssetsDrawer } from "./TransferAssetsDrawer";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, ArrowRightLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AdminManagementProps {
  user: User;
}

function AdminManagement({ user }: AdminManagementProps) {
  const { fetchAssets } = useAdmin();
  const [create, setCreate] = useState('');
  const [openCreateDrawer, setOpenCreateDrawer] = useState(false);
  const [openTransferDrawer, setOpenTransferDrawer] = useState(false);

  const createAsset = (assetID: string) => {
    setCreate(assetID);
  };

  const refreshAssets = async () => {
    await fetchAssets();
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
                Asset Management
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshAssets}
           className="py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.01]"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Asset Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Register new assets or transfer ownership of existing ones
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Register Asset Card */}
          <Card 
            className="group cursor-pointer transition-all hover:shadow-lg hover:border-purple-300"
            onClick={() => setOpenCreateDrawer(true)}
          >
            <div className="p-6 flex flex-col items-center text-center h-full">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <PlusCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Register New Asset</h3>
              <p className="text-sm text-gray-500 mb-4">
                Create a new asset record in the blockchain registry
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-auto border-gray-300 group-hover:border-purple-300 group-hover:text-purple-600"
              >
                Get Started
              </Button>
            </div>
          </Card>

          {/* Transfer Asset Card */}
          <Card 
            className="group cursor-pointer transition-all hover:shadow-lg hover:border-indigo-300"
            onClick={() => setOpenTransferDrawer(true)}
          >
            <div className="p-6 flex flex-col items-center text-center h-full">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ArrowRightLeft className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Transfer Ownership</h3>
              <p className="text-sm text-gray-500 mb-4">
                Change ownership of existing assets between users
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-auto border-gray-300 group-hover:border-indigo-300 group-hover:text-indigo-600"
              >
                Begin Transfer
              </Button>
            </div>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
          <Card>
            <div className="p-6 text-center">
              <p className="text-sm text-gray-500">
                Asset creation and transfer history will appear here
              </p>
              <Button variant="ghost" size="sm" className="mt-2 text-indigo-600">
                View Full History
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Drawers */}
      <CreateAssetDrawer
        createAsset={createAsset}
        user={user}
        openDrawer={openCreateDrawer}
        setOpenDrawer={setOpenCreateDrawer}
      />
      <TransferAssetsDrawer
        openDrawer={openTransferDrawer}
        setOpenDrawer={setOpenTransferDrawer}
        refreshAssets={refreshAssets}
      />
    </div>
  );
}

export default AdminManagement;