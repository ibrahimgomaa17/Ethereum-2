import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useUser } from "@/services/user";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export const RecallAssetDrawer = ({
  user,
  open,
  setOpen,
  onTransferComplete,
}: any) => {
  const { recallPreviouslyOwnedAssets } = useUser();
  const [privateKey, setPrivateKey] = useState("");

  useEffect(() => {
    if (open) {
      setPrivateKey("");
    }
  }, [open]);

  const handleRecall = async () => {
    if (!privateKey) {
      toast.error("Private key is required.");
      return;
    }

    const res = await recallPreviouslyOwnedAssets(user.walletAddress, privateKey);

    if (!res.error) {
      toast.success("Recall successful");
      setPrivateKey("");
      setOpen(false);
      onTransferComplete?.();
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Recall Asset</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key</Label>
            <Input
              id="privateKey"
              type="password"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleRecall}>Recall</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
