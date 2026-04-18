interface StatsCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  description?: string
  color?: "indigo" | "violet" | "blue" | "green"
}

const colorMap = {
  indigo: "bg-indigo-50 text-indigo-600",
  violet: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
}

export default function StatsCard({
  label,
  value,
  icon,
  description,
  color = "indigo",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {description && (
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      )}
    </div>
  )
}
