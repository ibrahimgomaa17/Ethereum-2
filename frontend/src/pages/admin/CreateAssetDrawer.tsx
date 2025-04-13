import { useState } from 'react';
import {
  Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useAdmin, CreateAsset, User,
} from '@/services/admin';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label'; // Add this line
import { toast } from 'sonner';

const PROPERTY_TYPES = ['Car', 'House', 'Land', 'Electronic Device', 'Furniture', 'Other'];

interface AssetManagementProps {
  user: User;
  createAsset: (id: string) => void;
  openDrawer: boolean;
  setOpenDrawer: any;
}

export const CreateAssetDrawer = ({ user, createAsset, openDrawer, setOpenDrawer }: AssetManagementProps) => {
  const { registerAsset } = useAdmin();
  const [newAsset, setNewAsset] = useState<CreateAsset>({
    adminPrivateKey: '',
    name: '',
    propertyType: '',
    serialNumber: '',
    location: '',
    owner: '',
    imageBase64: '',
  });

  const handleCreateAsset = async () => {
    const response = await registerAsset(newAsset);
    if ('message' in response) {
      toast.success(response.message);
      createAsset(response.message as string);
      setNewAsset({
        adminPrivateKey: '',
        name: '',
        propertyType: '',
        serialNumber: '',
        location: '',
        owner: '',
        imageBase64: '',
      });
    } else if ('error' in response) {
      toast.error(response.error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAsset(prev => ({
        ...prev,
        imageBase64: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const renderDynamicFields = () => {
    if (['House', 'Land'].includes(newAsset.propertyType)) {
      return (
        <div className="space-y-2">
          <Label htmlFor="location">Address</Label>
          <Input
            id="location"
            placeholder="Enter property address"
            value={newAsset.location}
            onChange={e => setNewAsset({ ...newAsset, location: e.target.value })}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create a New Asset</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input
              id="name"
              placeholder="Name"
              value={newAsset.name}
              onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select onValueChange={value => setNewAsset({ ...newAsset, propertyType: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Property Type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderDynamicFields()}

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number / Unique ID</Label>
            <Input
              id="serialNumber"
              placeholder="Serial Number / Unique ID"
              value={newAsset.serialNumber}
              onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="owner">Owner Address</Label>
            <Input
              id="owner"
              placeholder="0x..."
              value={newAsset.owner}
              onChange={e => setNewAsset({ ...newAsset, owner: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminKey">Admin Private Key</Label>
            <Input
              id="adminKey"
              placeholder="Admin Private Authority Signature"
              value={newAsset.adminPrivateKey}
              onChange={e => setNewAsset({ ...newAsset, adminPrivateKey: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUpload">Upload Image (optional)</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <DrawerFooter>
          <Button onClick={handleCreateAsset}>Submit</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAssetDrawer;
