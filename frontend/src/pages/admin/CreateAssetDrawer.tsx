import { useState } from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdmin, CreateAsset, User } from '@/services/admin';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const PROPERTY_TYPES = ['Car', 'House', 'Land', 'Electronic Device', 'Furniture', 'Other'];
interface AssetManagementProps {
    user: User; // Replace `any` with the appropriate type for `user` if available
}
export const CreateAssetDrawer = ({ user }: AssetManagementProps) => {
    const { registerAsset } = useAdmin();
    const [open, setOpen] = useState(false);
    const [newAsset, setNewAsset] = useState<CreateAsset>({
        adminPrivateKey: '',
        name: '',
        propertyType: '',
        serialNumber: '',
        location: '',
        owner: '',
    });

    const handleCreateAsset = async () => {
        const response = await registerAsset(newAsset);
    debugger
        if ('message' in response) {
          toast.success(response.message);
          setOpen(false);
          setNewAsset({ adminPrivateKey: '', name: '', propertyType: '', serialNumber: '', location: '', owner: '' });
        } else if ('error' in response) {
            toast.error(response.error);
        }
      };

    const renderDynamicFields = () => {
        switch (newAsset.propertyType) {
            case 'Car':
            case 'Electronic Device':
            case 'Furniture':
                return <Input placeholder="Serial Number" value={newAsset.serialNumber} onChange={e => setNewAsset({ ...newAsset, serialNumber: e.target.value })} />;
            case 'House':
            case 'Land':
                return <Input placeholder="Address" value={newAsset.location} onChange={e => setNewAsset({ ...newAsset, location: e.target.value })} />;
            default:
                return null;
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerTrigger asChild>
                <Button>Create Asset</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create a New Asset</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <Input placeholder="Name" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} />

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

                    {renderDynamicFields()}

                    <Input placeholder="Owner" value={newAsset.owner} onChange={e => setNewAsset({ ...newAsset, owner: e.target.value })} />
                    <Input placeholder="Admin Private Authority Signature" value={newAsset.adminPrivateKey} onChange={e => setNewAsset({ ...newAsset, adminPrivateKey: e.target.value })} />
                </div>
                <DrawerFooter>
                    <Button onClick={handleCreateAsset}>Submit</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default CreateAssetDrawer;
