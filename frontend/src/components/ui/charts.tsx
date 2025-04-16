import { cn } from "@/lib/utils"
import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface ChartProps {
  data: any[]
  children?: React.ReactNode
  className?: string
}

// ✅ BarChart with default height
export function BarChart({ data, children, className }: ChartProps) {
  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          {children}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ✅ LineChart with default height
export function LineChart({ data, children, className }: ChartProps) {
  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          {children}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

// ✅ PieChart with default height
export function PieChart({ data, children, className }: ChartProps) {
  return (
    <div className={cn("w-full h-[300px]", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          {children}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}

export {
  Bar,
  Line,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
}
