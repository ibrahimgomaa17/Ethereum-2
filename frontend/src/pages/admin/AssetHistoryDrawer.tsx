import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useProperty, TransferRecord } from '@/services/property'; // Ensure you have getTransferHistory in useProperty
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssetHistoryDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: any
  assetId: string;
}

export const AssetHistoryDrawer = ({ openDrawer, setOpenDrawer, assetId }: AssetHistoryDrawerProps) => {
  const { getTransferHistory } = useProperty();
  const [history, setHistory] = useState<TransferRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      if (!open || !assetId) return;

      setLoading(true);
      const res = await getTransferHistory(assetId);
      setHistory(res);
      setLoading(false);
    };

    loadHistory();
  }, [open, assetId]);

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Transfer History for {assetId}</DrawerTitle>
        </DrawerHeader>
        <ScrollArea className="p-4 space-y-4 max-h-[80vh]">
          {loading ? (
            <div>Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-muted-foreground">No transfer history found.</div>
          ) : (
            history.map((record, index) => (
              <div key={index} className="border p-3 rounded-md bg-muted">
                <div><strong>Previous Owner:</strong> {record.previousOwner}</div>
                <div><strong>New Owner:</strong> {record.newOwner}</div>
                <div><strong>Transferred By Admin:</strong> {record.transferredByAdmin ? 'Yes' : 'No'}</div>
                <div><strong>Date:</strong> {new Date(record.transferTime * 1000).toLocaleString()}</div>
              </div>
            ))
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default AssetHistoryDrawer;
