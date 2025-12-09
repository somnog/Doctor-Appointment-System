import { timeSlotsAPI } from "@/lib/api"
import DoctorTimeSlotsTableClient from "./time-slots-table-client"

async function getDoctorTimeSlots() {
  try {
    const timeSlots = await timeSlotsAPI.getAll()
    // TODO: Filter by current doctor ID from auth
    // For now, return all time slots
    return timeSlots
  } catch (error) {
    console.error("Error fetching doctor time slots:", error)
    return []
  }
}

export default async function DoctorTimeSlotsPage() {
  const timeSlots = await getDoctorTimeSlots()

  return <DoctorTimeSlotsTableClient initialData={timeSlots} />
}

