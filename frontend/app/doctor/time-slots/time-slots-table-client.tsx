"use client"

import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type TimeSlot } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface DoctorTimeSlotsTableClientProps {
  initialData: TimeSlot[]
}

export default function DoctorTimeSlotsTableClient({
  initialData,
}: DoctorTimeSlotsTableClientProps) {
  const router = useRouter()

  const columns: Column<TimeSlot>[] = [
    {
      key: "dayOfWeek",
      label: "Day of Week",
      render: (slot) => <Badge variant="outline">{slot.dayOfWeek}</Badge>,
    },
    {
      key: "startTime",
      label: "Start Time",
    },
    {
      key: "endTime",
      label: "End Time",
    },
    {
      key: "isAvailable",
      label: "Status",
      render: (slot) => (
        <Badge variant={slot.isAvailable ? "success" : "destructive"}>
          {slot.isAvailable ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      title="My Time Slots"
      columns={columns}
      data={initialData}
      onAddClick={() => router.push("/doctor/time-slots/new")}
      showAddButton={true}
      searchPlaceholder="Search time slots..."
    />
  )
}

