import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "@/components/ui/charts"

// Dummy data
const userGrowthData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 800 },
  { name: 'Apr', users: 1000 },
  { name: 'May', users: 1200 },
  { name: 'Jun', users: 1400 },
]

const assetDistributionData = [
  { name: 'Cars', value: 35 },
  { name: 'Houses', value: 25 },
  { name: 'Electronics', value: 20 },
  { name: 'Furniture', value: 15 },
  { name: 'Other', value: 5 },
]

const transferActivityData = [
  { name: 'Mon', transfers: 20 },
  { name: 'Tue', transfers: 35 },
  { name: 'Wed', transfers: 25 },
  { name: 'Thu', transfers: 40 },
  { name: 'Fri', transfers: 30 },
  { name: 'Sat', transfers: 15 },
  { name: 'Sun', transfers: 10 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const AdminDashboard = () => {
  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Admin Console
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-medium">
                Dashboard Overview
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* ... (keep your existing card code) ... */}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 h-[300px]">
              <LineChart data={userGrowthData}>
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
                  dataKey="users" 
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
              <CardTitle>Asset Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <PieChart data={assetDistributionData}>
                <Pie
                  data={assetDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {assetDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Transfer Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-sm text-muted-foreground">
                  View Details
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart data={transferActivityData}>
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
                  dataKey="transfers" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard