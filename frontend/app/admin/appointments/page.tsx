import { appointmentsAPI, type Appointment } from "@/lib/api"
import AppointmentsTableClient from "./appointments-table-client"

async function getAppointments() {
  try {
    return await appointmentsAPI.getAll()
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return []
  }
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments()

  return (
    <div className="space-y-8">
      <AppointmentsTableClient initialData={appointments} />
    </div>
  )
}
