import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProperty, TransferRecord } from '@/services/property';
import {
  CheckCircle2,
  ArrowDown,
  Clock,
  ShieldCheck,
  Loader2,
  PlusCircle,
  ArrowLeft,
  ClipboardCopyIcon,
  CheckIcon,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AssetHistoryDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  assetId: string;
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const AssetHistoryDrawer = ({
  openDrawer,
  setOpenDrawer,
  assetId
}: AssetHistoryDrawerProps) => {
  const { getTransferHistory } = useProperty();
  const [history, setHistory] = useState<TransferRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`, {
      icon: <CheckIcon className="h-4 w-4 text-green-500" />,
    });
  };
  
  useEffect(() => {
    const loadHistory = async () => {
      if (!openDrawer || !assetId) return;

      setLoading(true);
      try {
        const res = await getTransferHistory(assetId);
        setHistory(res.reverse()); // Show newest first
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [openDrawer, assetId]);

  const isCreationEvent = (record: TransferRecord) => {
    return record.previousOwner === ZERO_ADDRESS;
  };

  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer} direction="right">
     <DrawerContent className="h-screen max-w-md ml-auto">
        <DrawerHeader className="text-left border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Asset History
              </DrawerTitle>
              <DrawerDescription className="font-mono text-sm">
                {assetId}
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

        <ScrollArea className="h-[calc(95vh-57px)] px-6">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No history found for this asset
            </div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-gray-200 via-gray-200 to-gray-200" />

              <div className="space-y-6">
                {history.map((record, index) => (
                  <div key={index} className="relative">
                    {/* Timeline dot with connection line */}
                    <div className="absolute left-0 top-4 flex flex-col items-center">
                      {isCreationEvent(record) ? (
                        <div className="h-4 w-4 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <PlusCircle className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className={`
                          h-3 w-3 rounded-full border-4 z-10
                          ${index === 0 ?
                            'border-blue-500 bg-blue-100' :
                            'border-gray-300 bg-white'
                          }
                        `} />
                      )}
                      {index < history.length - 1 && (
                        <div className="h-12 w-px bg-gray-200 mt-1" />
                      )}
                    </div>

                    <div className="ml-8">
                      <div className={`rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-all ${isCreationEvent(record) ? 'border-green-100 bg-green-50' : 'border-gray-100'
                        }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {isCreationEvent(record) ? (
                              <>
                                <PlusCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm font-medium text-green-700">
                                  Asset Creation
                                </span>
                              </>
                            ) : (
                              <>
                                <div className={`p-1 rounded-full ${record.recalled ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'
                                  }`}>
                                  {record.recalled ? (
                                    <ArrowLeft className="h-3 w-3" />
                                  ) : (
                                    <ArrowRight className="h-3 w-3" />
                                  )}
                                </div>
                                <span className="text-sm font-medium">
                                  {record.recalled ? 'Recall Transfer' : 'Transfer'} #{history.length - index}
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {record.transferredByAdmin && (
                              <Badge variant="outline" className="text-xs gap-1 bg-purple-50 text-purple-600 border-purple-200">
                                <ShieldCheck className="h-3 w-3" />
                                Admin
                              </Badge>
                            )}
                            {record.recalled && (
                              <Badge variant="outline" className="text-xs gap-1 bg-red-50 text-red-600 border-red-200">
                                Recalled
                              </Badge>
                            )}
                          </div>
                        </div>

                        {isCreationEvent(record) ? (
                          <div className="space-y-2">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500">Registered to</p>
                              <div className="flex items-center gap-2">
                                <div className="font-mono text-sm break-all bg-green-50 p-2 rounded flex-1">
                                  {record.newOwner}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-gray-400 hover:text-gray-600"
                                  onClick={() => copyToClipboard(record.newOwner, 'Creator Address')}
                                >
                                  <ClipboardCopyIcon className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 gap-2">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-500">From</p>
                                <div className="flex items-center gap-2">
                                  <div className="font-mono text-sm break-all bg-red-50 p-2 rounded flex-1">
                                    {record.previousOwner}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-gray-400 hover:text-gray-600"
                                    onClick={() => copyToClipboard(record.previousOwner, 'Previous Owner')}
                                  >
                                    <ClipboardCopyIcon className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>

                              <div className="flex justify-center py-1">
                                <ArrowDown className="h-4 w-4 text-gray-400" />
                              </div>

                              <div className="space-y-1">
                                <p className="text-xs text-gray-500">To</p>
                                <div className="flex items-center gap-2">
                                  <div className="font-mono text-sm break-all bg-gray-50 p-2 rounded flex-1">
                                    {record.newOwner}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-gray-400 hover:text-gray-600"
                                    onClick={() => copyToClipboard(record.newOwner, 'New Owner')}
                                  >
                                    <ClipboardCopyIcon className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span>
                              {new Date(record.transferTime).toLocaleString([], {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {!isCreationEvent(record) && (
                            <Badge variant="outline" className="text-xs">
                              {record.transferredByAdmin ? 'Admin Action' : 'User Transfer'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default AssetHistoryDrawer;