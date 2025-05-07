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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, ImageIcon, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PROPERTY_TYPES = ['Car', 'House', 'Land', 'Electronic Device', 'Furniture', 'Other'];

interface AssetManagementProps {
  user: User;
  createAsset: (id: string) => void;
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleCreateAsset = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await registerAsset(newAsset);
      if ('message' in response) {
        toast.success('Asset created successfully!', {
          description: response.message,
        });
        createAsset(response.message as string);
        resetForm();
        setOpenDrawer(false);
      } else if ('error' in response) {
        toast.error('Failed to create asset', {
          description: response.error,
        });
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    if (!newAsset.name) {
      toast.error('Asset name is required');
      return false;
    }
    if (!newAsset.propertyType) {
      toast.error('Property type is required');
      return false;
    }
    if (!newAsset.serialNumber) {
      toast.error('Serial number is required');
      return false;
    }
    if (!newAsset.owner) {
      toast.error('Owner address is required');
      return false;
    }
    if (!newAsset.adminPrivateKey) {
      toast.error('Admin private key is required');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setNewAsset({
      adminPrivateKey: '',
      name: '',
      propertyType: '',
      serialNumber: '',
      location: '',
      owner: user.walletAddress || '',
      imageBase64: '',
    });
    setPreviewImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setNewAsset(prev => ({
        ...prev,
        imageBase64: result,
      }));
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setNewAsset(prev => ({
      ...prev,
      imageBase64: '',
    }));
    setPreviewImage(null);
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
      <DrawerContent className="h-full max-w-md ml-auto">
        <DrawerHeader className="text-left border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl font-semibold">Create New Asset</DrawerTitle>
              <p className="text-sm text-muted-foreground">
                Register a new asset for {user.userId}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenDrawer(false)}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Asset Preview */}
          {previewImage && (
            <div className="relative group">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={previewImage} 
                  alt="Asset preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white"
                onClick={removeImage}
              >
                <X className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Tesla Model 3, Manhattan Apartment"
                value={newAsset.name}
                onChange={e => setNewAsset({ ...newAsset, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Property Type *</Label>
                <Select 
                  value={newAsset.propertyType}
                  onValueChange={value => setNewAsset({ ...newAsset, propertyType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  placeholder="Unique identifier"
                  value={newAsset.serialNumber}
                  onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })}
                />
              </div>
            </div>

            {/* Dynamic Fields */}
            {renderDynamicFields()}

            {/* Owner Info */}
            <div className="space-y-2">
              <Label htmlFor="owner">Owner Address *</Label>
              <Input
                id="owner"
                placeholder="0x..."
                value={newAsset.owner}
                onChange={e => setNewAsset({ ...newAsset, owner: e.target.value })}
              />
          
            </div>

            {/* Admin Auth */}
            <div className="space-y-2">
              <Label htmlFor="adminKey">Admin Private Key *</Label>
              <Input
                id="adminKey"
                type="password"
                placeholder="Required for verification"
                value={newAsset.adminPrivateKey}
                onChange={e => setNewAsset({ ...newAsset, adminPrivateKey: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This key verifies your admin privileges
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="imageUpload">Asset Image (optional)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG (MAX. 2MB)
                    </p>
                  </div>
                  <input
                    id="imageUpload"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setOpenDrawer(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAsset}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.01]" 
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Asset'
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAssetDrawer;