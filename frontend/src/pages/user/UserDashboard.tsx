import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package, ArrowLeftRight, History } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from '@/components/ui/charts';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/services/user';
import { toast } from 'sonner';
import { User } from '@/services/admin';

const UserAssetDashboard = ({ user }:any) => {
  const [currentAssets, setCurrentAssets] = useState([] as any);
  const [previousAssets, setPreviousAssets] = useState([] as any);
  const [transferTimeline, setTransferTimeline] = useState([] as any);
  const [loading, setLoading] = useState(false);

  const { fetchUserAssets } = useUser();

  const loadAssets = async () => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      const { currentAssets, previouslyOwnedAssets } = await fetchUserAssets(user.walletAddress);
      setCurrentAssets(currentAssets);
      setPreviousAssets(previouslyOwnedAssets);

      // Build timeline data
      const historyMap = new Map();
      [...currentAssets, ...previouslyOwnedAssets].forEach((asset) => {
        const date = new Date(asset.lastTransferTime);
        const key = date.toISOString().split('T')[0]; // YYYY-MM-DD
        historyMap.set(key, (historyMap.get(key) || 0) + 1);
      });

      const timeline = Array.from(historyMap.entries()).map(([key, count]) => ({
        name: key,
        transfers: count,
      }));
      setTransferTimeline(timeline);
    } catch (error) {
      toast.error('Failed to load assets', {
        description: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [user.userId]);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 ">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Total Owned
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentAssets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Previously Owned (Admin Transfered)
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{previousAssets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" /> Transfer Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transferTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="transfers"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Asset Lists */}
      <div className="grid gap-4">
        {/* Current Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Your Current Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentAssets.length === 0 && <p className="text-muted-foreground">No current assets found.</p>}
            {currentAssets.map((asset:any) => (
              <div key={asset.uniqueId} className="border rounded p-3 flex justify-between">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.propertyType} · {asset.location}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{new Date(asset.lastTransferTime).toLocaleDateString()}</p>
                  {asset.transferredByAdmin && <Badge variant="secondary">Admin Transfer</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Previously Owned Assets */}
        <Card>
          <CardHeader>
            <CardTitle>Previously Owned Assets (Admin Transfered)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {previousAssets.length === 0 && <p className="text-muted-foreground">No previous assets.</p>}
            {previousAssets.map((asset) => (
              <div key={asset.uniqueId} className="border rounded p-3 flex justify-between">
                <div>
                  <p className="font-medium">{asset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {asset.propertyType} · {asset.location}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p>{new Date(asset.lastTransferTime).toLocaleDateString()}</p>
                  {asset.transferredByAdmin && <Badge variant="destructive">Reclaimable</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAssetDashboard;
