"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type Appointment } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { AddAppointmentModal } from "@/components/admin/add-appointment-modal"

interface AppointmentsTableClientProps {
  initialData: Appointment[]
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "success"
    case "PENDING":
      return "warning"
    case "COMPLETED":
      return "default"
    case "CANCELLED":
      return "destructive"
    default:
      return "outline"
  }
}

export default function AppointmentsTableClient({
  initialData,
}: AppointmentsTableClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = () => {
    router.refresh()
  }

  const columns: Column<Appointment>[] = [
    {
      key: "patient",
      label: "Patient",
      render: (appointment) => (
        <span className="font-medium">
          {appointment.patient?.fullName || "N/A"}
        </span>
      ),
    },
    {
      key: "doctor",
      label: "Doctor",
      render: (appointment) =>
        appointment.doctor?.user?.fullName || "N/A",
    },
    {
      key: "appointmentDate",
      label: "Date",
      render: (appointment) =>
        format(new Date(appointment.appointmentDate), "MMM dd, yyyy"),
    },
    {
      key: "time",
      label: "Time",
      render: (appointment) =>
        `${appointment.startTime} - ${appointment.endTime}`,
    },
    {
      key: "status",
      label: "Status",
      render: (appointment) => (
        <Badge variant={getStatusBadgeVariant(appointment.status)}>
          {appointment.status}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (appointment) =>
        format(new Date(appointment.createdAt), "MMM dd, yyyy"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (appointment) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/appointments/${appointment.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        title="All Appointments"
        columns={columns}
        data={initialData}
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={true}
        searchPlaceholder="Search appointments..."
      />
      <AddAppointmentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}
