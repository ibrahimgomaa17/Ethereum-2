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
import { Label } from '@/components/ui/label';
import { ArrowRight, Key, Hash, User as UserIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

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

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (assetId) {
      setFormData(prev => ({ ...prev, uniqueId: assetId }));
    }
  }, [assetId]);

  const handleTransfer = async () => {
    setIsLoading(true);
    try {
      const res = await transferAsset({
        uniqueId: formData.uniqueId,
        toAddress: formData.recipient,
        privateKey: formData.privateKey,
      });

      if (!res.response?.error) {
        toast.success('Transfer successful', {
          description: res.response.message || 'Asset has been transferred successfully',
        });
        setFormData({ uniqueId: '', recipient: '', privateKey: '' });
        setOpen(false);
        onTransferComplete?.();
      } else {
        toast.error('Transfer failed', {
          description: res.response.error || 'Something went wrong during the transfer',
        });
      }
    } catch (error) {
      toast.error('Transfer error', {
        description: 'An unexpected error occurred during the transfer',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="h-full max-w-md">
        <DrawerHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <DrawerTitle className="text-xl">Transfer Asset</DrawerTitle>
          </div>
        </DrawerHeader>
        
        <div className="p-6 space-y-6">
          <Card className="bg-muted/50">
            <div className="p-4 space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Current Owner</p>
              <p className="font-mono text-sm truncate">{user.walletAddress}</p>
            </div>
          </Card>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uniqueId" className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Asset Unique ID
              </Label>
              <Input
                id="uniqueId"
                placeholder="Enter asset ID"
                value={formData.uniqueId}
                onChange={(e) =>
                  setFormData({ ...formData, uniqueId: e.target.value })
                }
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Recipient Address
              </Label>
              <Input
                id="recipient"
                placeholder="Enter recipient wallet address"
                value={formData.recipient}
                onChange={(e) =>
                  setFormData({ ...formData, recipient: e.target.value })
                }
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="privateKey" className="flex items-center gap-2">
                <Key className="h-4 w-4 text-muted-foreground" />
                Your Private Key
              </Label>
              <Input
                id="privateKey"
                type="password"
                placeholder="Enter your private key"
                value={formData.privateKey}
                onChange={(e) =>
                  setFormData({ ...formData, privateKey: e.target.value })
                }
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">
                Your private key is used to sign the transaction and won't be stored
              </p>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTransfer}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md transition-all transform hover:scale-[1.01]" 
              disabled={!formData.uniqueId || !formData.recipient || !formData.privateKey}
            >
              {isLoading ? 'Transferring...' : 'Confirm Transfer'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransferAssetDrawer;