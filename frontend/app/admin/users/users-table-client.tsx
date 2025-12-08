"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import DataTable, { type Column } from "@/components/comman/datatable"
import { type User } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { AddUserModal } from "@/components/admin/add-user-modal"

interface UsersTableClientProps {
  initialData: User[]
}

function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "ADMIN":
      return "default"
    case "DOCTOR":
      return "secondary"
    case "PATIENT":
      return "outline"
    default:
      return "outline"
  }
}

export default function UsersTableClient({
  initialData,
}: UsersTableClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSuccess = () => {
    router.refresh()
  }

  const columns: Column<User>[] = [
    {
      key: "fullName",
      label: "Name",
      render: (user) => <span className="font-medium">{user.fullName}</span>,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phoneNumber",
      label: "Phone",
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
      ),
    },
    {
      key: "dateOfBirth",
      label: "Date of Birth",
      render: (user) =>
        user.dateOfBirth
          ? new Date(user.dateOfBirth).toLocaleDateString()
          : "-",
    },
    {
      key: "createdAt",
      label: "Created At",
      render: (user) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (user) => (
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
    <>
      <DataTable
        title="All Users"
        columns={columns}
        data={initialData}
        onAddClick={() => setIsModalOpen(true)}
        showAddButton={true}
        searchPlaceholder="Search users..."
      />
      <AddUserModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleSuccess}
      />
    </>
  )
}
