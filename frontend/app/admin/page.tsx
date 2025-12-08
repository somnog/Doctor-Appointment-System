import { usersAPI, appointmentsAPI, doctorProfilesAPI } from "@/lib/api"
import { Users, UserCheck, UserCog, TrendingUp, TrendingDown } from "lucide-react"
import DashboardCharts from "./dashboard-charts"

async function getDashboardStats() {
  try {
    const [users, appointments, doctors] = await Promise.all([
      usersAPI.getAll().catch(() => []),
      appointmentsAPI.getAll().catch(() => []),
      doctorProfilesAPI.getAll().catch(() => []),
    ])

    const totalUsers = users.length
    const totalPatients = users.filter((u) => u.role === "PATIENT").length
    const totalAdmins = users.filter((u) => u.role === "ADMIN").length
    const totalDoctors = users.filter((u) => u.role === "DOCTOR").length
    const totalAppointments = appointments.length
    const pendingAppointments = appointments.filter(
      (a) => a.status === "PENDING"
    ).length
    const confirmedAppointments = appointments.filter(
      (a) => a.status === "CONFIRMED"
    ).length
    const completedAppointments = appointments.filter(
      (a) => a.status === "COMPLETED"
    ).length
    // Active appointments = only CONFIRMED (not including PENDING to avoid double counting)
    const activeAppointments = confirmedAppointments

    return {
      totalUsers,
      totalPatients,
      totalAdmins,
      totalDoctors,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      activeAppointments,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalUsers: 0,
      totalPatients: 0,
      totalAdmins: 0,
      totalDoctors: 0,
      totalAppointments: 0,
      pendingAppointments: 0,
      confirmedAppointments: 0,
      completedAppointments: 0,
      activeAppointments: 0,
    }
  }
}

function CircularProgress({ percentage }: { percentage: number }) {
  const circumference = 2 * Math.PI * 12
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-6 h-6">
      <svg className="transform -rotate-90 w-6 h-6">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e5e7eb"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[8px] font-semibold text-gray-700">{percentage}%</span>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  // Use totalUsers for percentage calculations
  const totalForPercentage = Math.max(stats.totalUsers, 1)

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      description: "+12% vs last month",
      icon: Users,
      iconBg: "bg-blue-600",
      trend: "up",
      trendColor: "text-green-600",
      progress: Math.round((stats.totalPatients / totalForPercentage) * 100),
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins,
      description: "+5% vs last month",
      icon: UserCog,
      iconBg: "bg-blue-400",
      trend: "up",
      trendColor: "text-green-600",
      progress: Math.round((stats.totalAdmins / totalForPercentage) * 100),
    },
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      description: "+8% vs last month",
      icon: UserCheck,
      iconBg: "bg-purple-600",
      trend: "up",
      trendColor: "text-green-600",
      progress: Math.round((stats.totalDoctors / totalForPercentage) * 100),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg p-4 relative overflow-hidden shadow-sm border border-gray-200"
          >
            {/* Circular Progress Indicator - Top Right */}
            <div className="absolute top-2 right-2">
              <CircularProgress percentage={stat.progress} />
            </div>

            {/* Icon - Top Left */}
            <div className={`${stat.iconBg} w-8 h-8 rounded-lg flex items-center justify-center mb-2`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>

            {/* Main Value */}
            <div className="text-2xl font-bold text-gray-900 mb-0.5">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-gray-700 text-xs font-medium mb-2">
              {stat.title}
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center gap-1">
              {stat.trend === "up" ? (
                <TrendingUp className={`h-3 w-3 ${stat.trendColor}`} />
              ) : (
                <TrendingDown className={`h-3 w-3 ${stat.trendColor}`} />
              )}
              <span className={`text-xs ${stat.trendColor}`}>
                {stat.description}
              </span>
            </div>
          </div>
        ))}
      </div>

      <DashboardCharts stats={stats} />
    </div>
  )
}
