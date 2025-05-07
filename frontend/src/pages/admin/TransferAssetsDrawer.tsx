import { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/services/admin';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, ShieldAlert, ClipboardCopy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TransferAssetsDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  refreshAssets: () => void;
  currentOwner?: string; // Optional prop to pre-fill current owner
}

export const TransferAssetsDrawer = ({
  openDrawer,
  setOpenDrawer,
  refreshAssets,
  currentOwner = '',
}: TransferAssetsDrawerProps) => {
  const { transferAllAssets } = useAdmin();
  const [transferData, setTransferData] = useState({
    fromAddress: currentOwner,
    newOwnerAddress: '',
    senderPrivateKey: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTransfer = async () => {
    const { fromAddress, newOwnerAddress, senderPrivateKey } = transferData;

    if (!fromAddress || !newOwnerAddress || !senderPrivateKey) {
      toast.error('Please fill all required fields', {
        icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
      });
      return;
    }

    if (fromAddress === newOwnerAddress) {
      toast.error('Cannot transfer to the same address', {
        icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await transferAllAssets({
        fromAddress,
        toAddress: newOwnerAddress,
        adminPrivateKey: senderPrivateKey,
      });

      if ('message' in response) {
        toast.success('Transfer successful!', {
          icon: <Check className="h-4 w-4 text-green-500" />,
          description: response.message,
        });
        resetForm();
        setOpenDrawer(false);
        refreshAssets();
      } else {
        toast.error('Transfer failed', {
          icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
          description: response.error || 'Please check the addresses and try again',
        });
      }
    } catch (err) {
      toast.error('Transfer failed', {
        icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTransferData({
      fromAddress: currentOwner,
      newOwnerAddress: '',
      senderPrivateKey: '',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard', {
      icon: <Check className="h-4 w-4 text-green-500" />,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
      <DrawerContent className="h-full max-w-md ml-auto">
        <DrawerHeader className="text-left border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-indigo-600" />
                Bulk Asset Transfer
              </DrawerTitle>
              <DrawerDescription>
                Transfer all assets from one owner to another
              </DrawerDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenDrawer(false)}
              className="rounded-full"
            >
              &times;
            </Button>
          </div>
        </DrawerHeader>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="fromAddress">Current Owner Address *</Label>
              {currentOwner && (
                <Badge 
                  variant="outline" 
                  className="text-xs cursor-pointer hover:bg-gray-100"
                  onClick={() => setTransferData({...transferData, fromAddress: currentOwner})}
                >
                  Use Current
                </Badge>
              )}
            </div>
            <div className="relative">
              <Input
                id="fromAddress"
                placeholder="0x..."
                value={transferData.fromAddress}
                onChange={e =>
                  setTransferData({ ...transferData, fromAddress: e.target.value })
                }
                className="pr-10"
              />
              {transferData.fromAddress && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => copyToClipboard(transferData.fromAddress)}
                >
                  <ClipboardCopy className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="newOwnerAddress">New Owner Address *</Label>
            <div className="relative">
              <Input
                id="newOwnerAddress"
                placeholder="0x..."
                value={transferData.newOwnerAddress}
                onChange={e =>
                  setTransferData({ ...transferData, newOwnerAddress: e.target.value })
                }
                className="pr-10"
              />
              {transferData.newOwnerAddress && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-9 w-9"
                  onClick={() => copyToClipboard(transferData.newOwnerAddress)}
                >
                  <ClipboardCopy className="h-4 w-4 text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="adminKey">Admin Private Key *</Label>
            <Input
              id="adminKey"
              type="password"
              placeholder="Required for authorization"
              value={transferData.senderPrivateKey}
              onChange={e =>
                setTransferData({ ...transferData, senderPrivateKey: e.target.value })
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              This key verifies your admin privileges
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-amber-800 mb-1">Important Notice</h4>
                <p className="text-sm text-amber-700">
                  This action will transfer ALL assets from the current owner to the new owner.
                  Please verify both addresses before proceeding.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setOpenDrawer(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Transfer All
                </>
              )}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransferAssetsDrawer;