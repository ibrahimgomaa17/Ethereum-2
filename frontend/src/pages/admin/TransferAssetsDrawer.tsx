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

        <Input
          placeholder="Current Owner Address"
          value={transferData.fromAddress}
          onChange={e => setTransferData({ ...transferData, fromAddress: e.target.value })}
        />

        <Input
          placeholder="New Owner Address"
          value={transferData.newOwnerAddress}
          onChange={e => setTransferData({ ...transferData, newOwnerAddress: e.target.value })}
        />

        <Input
          placeholder="Admin's Signature Key"
          type="password"
          value={transferData.senderPrivateKey}
          onChange={e => setTransferData({ ...transferData, senderPrivateKey: e.target.value })}
        />

        <DrawerFooter>
          <Button onClick={handleTransfer}>Transfer All</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransferAssetsDrawer;
