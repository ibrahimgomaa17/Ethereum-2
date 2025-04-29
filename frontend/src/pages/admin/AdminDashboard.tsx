import { useEffect, useState } from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@radix-ui/react-separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
  Cell,
} from "@/components/ui/charts"
import { DashboardMetrics, useAdmin } from "@/services/admin"
import { useBlockchain } from "@/services/blockchain"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const AdminDashboard = () => {
  const { fetchDashboardMetrics } = useAdmin()
  const { getTransactionsNumber } = useBlockchain()
  const [dashboardData, setDashboardData] = useState<DashboardMetrics | null>(null)
  const [transactions, setTransactions] = useState<number>(0)

  let fetched = false;

  useEffect(() => {
    const load = async () => {
      if (fetched) return;
      fetched = true;
      const [data, transactions] = await Promise.all([
        fetchDashboardMetrics(),
        getTransactionsNumber(),
      ]);
      setTransactions(transactions as number);
      setDashboardData(data);
    };
    load();
  }, []);

  const registrations = dashboardData?.charts.registrationsByTime ?? []
  const transfers = dashboardData?.charts.transactionsByTime ?? []
  const distribution = dashboardData?.charts.assetDistribution ?? []

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

      </header>

      <main className="flex-1 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {dashboardData?.metrics.totalUsers ?? "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Properties</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {dashboardData?.metrics.totalAssets ?? "—"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Transactions</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">
              {transactions ?? "—"}
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mb-6">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Property Registrations Over Time</CardTitle>
            </CardHeader>
            <CardContent className="pl-2 h-[300px]">
              <LineChart data={registrations}>
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
                  dataKey="value"
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
              <PieChart data={distribution}>
                <Pie
                  data={distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distribution.map((entry, index) => (
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
                <CardTitle>Transactions Over Time</CardTitle>

              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChart data={transfers}>
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
      </main>
    </div>
  )
}

export default AdminDashboard
function getTransactionsNumber() {
  throw new Error("Function not implemented.")
}

