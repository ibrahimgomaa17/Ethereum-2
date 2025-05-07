import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useUser } from "@/services/user";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft, Key } from "lucide-react";
import { cn } from "@/lib/utils";

export const RecallAssetDrawer = ({
  user,
  open,
  setOpen,
  onTransferComplete,
}: {
  user: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  onTransferComplete?: () => void;
}) => {
  const { recallPreviouslyOwnedAssets } = useUser();
  const [privateKey, setPrivateKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setPrivateKey("");
    }
  }, [open]);

  const handleRecall = async () => {
    if (!privateKey) {
      toast.error("Private key is required", {
        description: "Please enter your private key to proceed",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await recallPreviouslyOwnedAssets(user.walletAddress, privateKey);

      if (!res.error) {
        toast.success("Assets recalled successfully", {
          description: "Your previously owned assets have been transferred back to you",
        });
        setPrivateKey("");
        setOpen(false);
        onTransferComplete?.();
      } else {
        toast.error("Recall failed", {
          description: res.error || "An unknown error occurred",
        });
      }
    } catch (error) {
      toast.error("Recall failed", {
        description: "Please check your private key and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent className="h-full max-w-md ml-auto">
        <DrawerHeader className="text-left border-b p-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <DrawerTitle className="text-xl font-semibold tracking-tight">
                Recall Assets
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground">
                Reclaim your previously owned assets
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="p-6 space-y-6">
          <div className="rounded-lg bg-muted/50 p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">Security Notice</p>
              <p className="text-xs text-muted-foreground">
                For security reasons, we don't store your private key. Make sure you're in a secure environment before entering it.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privateKey" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>Private Key</span>
              </Label>
              <Input
                id="privateKey"
                type="password"
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="text-xs text-muted-foreground">
              <p>This action will transfer all your previously owned assets back to your current wallet.</p>
            </div>
          </div>
        </div>

        <DrawerFooter className="p-6 border-t">
          <Button 
            onClick={handleRecall}
            size="lg"
            disabled={!privateKey || isLoading}
            className={cn(
              "w-full font-medium transition-all",
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            )}
          >
            {isLoading ? "Processing..." : "Recall Assets"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};