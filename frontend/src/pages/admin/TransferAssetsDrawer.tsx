import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/services/admin';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label'; // Make sure this is available in your components

interface TransferAssetsDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  refreshAssets: () => void;
}

export const TransferAssetsDrawer = ({
  openDrawer,
  setOpenDrawer,
  refreshAssets,
}: TransferAssetsDrawerProps) => {
  const { transferAllAssets } = useAdmin();
  const [transferData, setTransferData] = useState({
    fromAddress: '',
    newOwnerAddress: '',
    senderPrivateKey: '',
  });

  const handleTransfer = async () => {
    const { fromAddress, newOwnerAddress, senderPrivateKey } = transferData;

    if (!fromAddress || !newOwnerAddress || !senderPrivateKey) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await transferAllAssets({
        fromAddress,
        toAddress: newOwnerAddress,
        adminPrivateKey: senderPrivateKey,
      });

      if ('message' in response) {
        toast.success(response.message);
        setTransferData({
          fromAddress: '',
          newOwnerAddress: '',
          senderPrivateKey: '',
        });
        setOpenDrawer(false);
        refreshAssets();
      } else {
        toast.error(response.error || 'Transfer failed');
      }
    } catch (err) {
      toast.error('Transfer failed. Please try again.');
    }
  };

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
      <DrawerContent className="p-4 space-y-4">
        <DrawerHeader>
          <DrawerTitle>Transfer All Assets</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-2">
          <Label htmlFor="fromAddress">Current Owner Address</Label>
          <Input
            id="fromAddress"
            placeholder="0x..."
            value={transferData.fromAddress}
            onChange={e =>
              setTransferData({ ...transferData, fromAddress: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newOwnerAddress">New Owner Address</Label>
          <Input
            id="newOwnerAddress"
            placeholder="0x..."
            value={transferData.newOwnerAddress}
            onChange={e =>
              setTransferData({ ...transferData, newOwnerAddress: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminKey">Admin's Private Key</Label>
          <Input
            id="adminKey"
            type="password"
            placeholder="Private key"
            value={transferData.senderPrivateKey}
            onChange={e =>
              setTransferData({ ...transferData, senderPrivateKey: e.target.value })
            }
          />
        </div>

        <DrawerFooter>
          <Button onClick={handleTransfer}>Transfer All</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransferAssetsDrawer;
