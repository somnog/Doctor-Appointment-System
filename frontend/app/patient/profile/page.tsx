import { usersAPI } from "@/lib/api"
import PatientProfileClient from "./profile-client"

async function getPatientProfile() {
  try {
    // TODO: Get current patient user ID from auth
    // For now, get first patient user as example
    const users = await usersAPI.getAll()
    const patient = users.find((u) => u.role === "PATIENT")
    
    if (!patient) {
      return null
    }
    
    return patient
  } catch (error) {
    console.error("Error fetching patient profile:", error)
    return null
  }
}

export default async function PatientProfilePage() {
  const user = await getPatientProfile()

  if (!user) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <p className="text-gray-600">No profile found.</p>
      </div>
    )
  }

  return <PatientProfileClient user={user} />
}

