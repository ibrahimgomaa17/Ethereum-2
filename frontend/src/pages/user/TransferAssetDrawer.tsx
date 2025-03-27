import { useEffect, useState } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/services/user';
import { toast } from 'sonner';
import { User } from '@/services/admin';

interface TransferAssetDrawerProps {
    user: User;
    assetId: string | null;
    open: boolean;
    setOpen: (state: boolean) => void;
    onTransferComplete?: () => void;
}

export const TransferAssetDrawer = ({
    assetId,
    user,
    open,
    setOpen,
    onTransferComplete,
}: TransferAssetDrawerProps) => {
    const { transferAsset } = useUser();

    const [formData, setFormData] = useState({
        uniqueId: '',
        recipient: '',
        privateKey: '',
    });

    useEffect(() => {
        if (assetId) {
            setFormData(prev => ({ ...prev, uniqueId: assetId }));
        }
    }, [assetId]);

    const handleTransfer = async () => {
        const res = await transferAsset({
            uniqueId: formData.uniqueId,
            toAddress: formData.recipient,
            privateKey: formData.privateKey,
        });

        if ('message' in res) {
            toast.success(res.message);
            setFormData({ uniqueId: '', recipient: '', privateKey: '' });
            setOpen(false);
            onTransferComplete?.();
        } else {
            toast.error(res.error || 'Something went wrong');
        }
    };

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="right">
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Transfer Asset</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <Input
                        placeholder="Asset Unique ID"
                        value={formData.uniqueId}
                        onChange={(e) =>
                            setFormData({ ...formData, uniqueId: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Recipient Address"
                        value={formData.recipient}
                        onChange={(e) =>
                            setFormData({ ...formData, recipient: e.target.value })
                        }
                    />
                    <Input
                        placeholder="Your Private Key"
                        value={formData.privateKey}
                        onChange={(e) =>
                            setFormData({ ...formData, privateKey: e.target.value })
                        }
                    />
                </div>
                <DrawerFooter>
                    <Button onClick={handleTransfer}>Transfer</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default TransferAssetDrawer;
