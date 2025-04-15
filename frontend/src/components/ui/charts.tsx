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

export function BarChart({ data, children, className }: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data}>
          {children}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LineChart({ data, children, className }: ChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          {children}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PieChart({ data, children, className }: ChartProps) {
  return (
    <div className={className}>
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