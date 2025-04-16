import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package,
  History,
  ArrowRight,
  RefreshCw,
  Download,
  Wallet,
  Shield,
  BarChart4,
  Clock,
  FileText
} from "lucide-react";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "@/components/ui/charts";
import { Badge } from "@/components/ui/badge";

// Dummy data
const assetActivityData = [
  { name: 'Jan', transfers: 2 },
  { name: 'Feb', transfers: 3 },
  { name: 'Mar', transfers: 1 },
  { name: 'Apr', transfers: 4 },
  { name: 'May', transfers: 2 },
  { name: 'Jun', transfers: 3 },
];

const assetValueData = [
  { name: 'Cars', value: 45000 },
  { name: 'Electronics', value: 12000 },
  { name: 'Collectibles', value: 8000 },
];

const recentTransfers = [
  { id: 'AST-7890', type: 'Car', date: '2023-06-15', status: 'Completed' },
  { id: 'AST-4567', type: 'Laptop', date: '2023-06-10', status: 'Pending' },
  { id: 'AST-1234', type: 'Watch', date: '2023-06-05', status: 'Completed' },
];

const UserDashboard = () => {
  return (
    <div className="flex flex-col h-full bg-muted/40">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                User Portal
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">
                Asset Dashboard
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 ETH</div>
              <p className="text-xs text-muted-foreground">≈ $5,824.00</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Transfers</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">1 pending approval</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Insurance Coverage</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8 Assets</div>
              <p className="text-xs text-muted-foreground">$42,000 total coverage</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  Asset Activity
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pl-2 h-[300px]">
              <LineChart data={assetActivityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
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
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart4 className="h-5 w-5 text-primary" />
                Asset Value Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart data={assetValueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Bar 
                  dataKey="value" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Transfers
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentTransfers.map((transfer) => (
                  <div key={transfer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{transfer.id}</p>
                        <p className="text-sm text-muted-foreground">{transfer.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{transfer.date}</p>
                      <Badge 
                        variant={transfer.status === 'Completed' ? 'default' : 'secondary'} 
                        className="mt-1"
                      >
                        {transfer.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <Button variant="outline" className="w-full">
                Initiate New Transfer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;