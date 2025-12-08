"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type DoctorProfile } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { AddDoctorModal } from "@/components/admin/add-doctor-modal"

interface DoctorsTableClientProps {
  initialData: DoctorProfile[]
}

export default function DoctorsTableClient({
  initialData,
}: DoctorsTableClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = () => {
    router.refresh()
  }

  const columns: Column<DoctorProfile>[] = [
    {
      key: "user",
      label: "Doctor Name",
      render: (doctor) => (
        <span className="font-medium">
          {doctor.user?.fullName || "N/A"}
        </span>
      ),
    },
    {
      key: "specialization",
      label: "Specialization",
      render: (doctor) => (
        <Badge variant="secondary">{doctor.specialization}</Badge>
      ),
    },
    {
      key: "experience",
      label: "Experience",
      render: (doctor) => `${doctor.experience} years`,
    },
    {
      key: "consultationFee",
      label: "Consultation Fee",
      render: (doctor) => `$${doctor.consultationFee.toFixed(2)}`,
    },
    {
      key: "licenseNumber",
      label: "License Number",
      render: (doctor) => (
        <span className="font-mono text-sm">{doctor.licenseNumber}</span>
      ),
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (doctor) => new Date(doctor.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (doctor) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/doctors/${doctor.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
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
    <>
      <DataTable
        title="All Doctors"
        columns={columns}
        data={initialData}
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={true}
        searchPlaceholder="Search doctors..."
      />
      <AddDoctorModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}
