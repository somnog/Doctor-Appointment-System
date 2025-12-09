"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type DoctorProfile, doctorProfilesAPI } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { AddDoctorModal } from "@/components/admin/add-doctor-modal"
import { EditDoctorModal } from "@/components/admin/edit-doctor-modal"
import ConfirmDeleteModal from "@/components/comman/delete-model"

interface DoctorsTableClientProps {
  initialData: DoctorProfile[]
}

export default function DoctorsTableClient({
  initialData,
}: DoctorsTableClientProps) {
  const router = useRouter()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null)

  const handleSuccess = () => {
    router.refresh()
  }

  const handleEdit = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor)
    setIsEditModalOpen(true)
  }

  const handleDelete = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedDoctor) return

    try {
      await doctorProfilesAPI.delete(selectedDoctor.id)
      handleSuccess()
      setIsDeleteModalOpen(false)
      setSelectedDoctor(null)
    } catch (error: any) {
      console.error("Error deleting doctor:", error)
      alert(error?.message || "Failed to delete doctor. Please try again.")
    }
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
      key: "actions",
      label: "Actions",
      render: (doctor) => (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/doctors/${doctor.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(doctor)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(doctor)}>
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
        onAddClick={() => setIsAddModalOpen(true)}
        showAddButton={true}
        searchPlaceholder="Search doctors..."
      />
      <AddDoctorModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleSuccess}
      />
      <EditDoctorModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleSuccess}
        doctor={selectedDoctor}
      />
      <ConfirmDeleteModal
        show={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedDoctor(null)
        }}
        onConfirm={confirmDelete}
        itemName="doctor"
      />
    </>
  )
}
