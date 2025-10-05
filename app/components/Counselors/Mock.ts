import { AppointmentStatus } from "@/app/generated/prisma";
import { AppointmentData } from "../Appointments/AppointmentsActions";

export async function getMockCounselorAppointments(
  date: Date
): Promise<AppointmentData[]> {
  console.log("Fetching mock appointments for date:", date);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  const appointments: AppointmentData[] = [
    {
      id: "mock-1",
      studentId: "mock-student-1",
      counselorId: "mock-counselor-1",
      status: "Approved" as AppointmentStatus,
      createdAt: new Date(),
      focus: "Academic Counseling",
      hadCounselingBefore: true,
      sessionPreference: "InPerson" as any,
      urgencyLevel: 3,
      startTime: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        8,
        30,
        0
      ), // Today at 8:30 AM
      endTime: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        9,
        15,
        0
      ), // Today at 9:15 AM (45 min)
      notes: "First session for academic guidance - BSIT 3A",
      room: "Room 101",
      student: {
        user: {
          id: "mock-student-1",
          name: "Joy Dela Cruz",
          email: "joy.delacruz@example.com",
          section: "A",
          program: "BSIT",
          year: 3,
        },
      },
    },
    {
      id: "mock-2",
      studentId: "mock-student-2",
      counselorId: "mock-counselor-1",
      status: "Pending" as AppointmentStatus,
      createdAt: new Date(),
      focus: "Career Guidance",
      hadCounselingBefore: false,
      sessionPreference: "Online" as any,
      urgencyLevel: 2,
      startTime: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        10,
        0,
        0
      ), // Today at 10:00 AM
      endTime: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        11,
        0,
        0
      ), // Today at 11:00 AM (60 min)
      notes: "Career planning session - BSCS 2B",
      room: null,
      student: {
        user: {
          id: "mock-student-2",
          name: "Maria Santos",
          email: "maria.santos@example.com",
          section: "B",
          program: "BSCS",
          year: 2,
        },
      },
    },
    {
      id: "mock-3",
      studentId: "mock-student-3",
      counselorId: "mock-counselor-1",
      status: "Completed" as AppointmentStatus,
      createdAt: new Date(),
      focus: "Personal Counseling",
      hadCounselingBefore: true,
      sessionPreference: "InPerson" as any,
      urgencyLevel: 4,
      startTime: new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        9,
        0,
        0
      ), // Tomorrow at 9:00 AM
      endTime: new Date(
        tomorrow.getFullYear(),
        tomorrow.getMonth(),
        tomorrow.getDate(),
        9,
        30,
        0
      ), // Tomorrow at 9:30 AM (30 min)
      notes: "Follow-up session - BSA 4A",
      room: "Room 102",
      student: {
        user: {
          id: "mock-student-3",
          name: "John Doe",
          email: "john.doe@example.com",
          section: "A",
          program: "BSA",
          year: 4,
        },
      },
    },
    {
      id: "mock-4",
      studentId: "mock-student-4",
      counselorId: "mock-counselor-1",
      status: "Approved" as AppointmentStatus,
      createdAt: new Date(),
      focus: "Study Skills",
      hadCounselingBefore: false,
      sessionPreference: "Either" as any,
      urgencyLevel: 1,
      startTime: new Date(
        dayAfterTomorrow.getFullYear(),
        dayAfterTomorrow.getMonth(),
        dayAfterTomorrow.getDate(),
        8,
        15,
        0
      ), // Day after tomorrow at 8:15 AM
      endTime: new Date(
        dayAfterTomorrow.getFullYear(),
        dayAfterTomorrow.getMonth(),
        dayAfterTomorrow.getDate(),
        9,
        0,
        0
      ), // Day after tomorrow at 9:00 AM (45 min)
      notes: "Time management and study techniques - BSBA 1A",
      room: "Room 103",
      student: {
        user: {
          id: "mock-student-4",
          name: "Anna Garcia",
          email: "anna.garcia@example.com",
          section: "A",
          program: "BSBA",
          year: 1,
        },
      },
    },
    {
      id: "mock-5",
      studentId: "mock-student-5",
      counselorId: "mock-counselor-1",
      status: "Rejected" as AppointmentStatus,
      createdAt: new Date(),
      focus: "Stress Management",
      hadCounselingBefore: true,
      sessionPreference: "Online" as any,
      urgencyLevel: 5,
      startTime: new Date(
        nextWeek.getFullYear(),
        nextWeek.getMonth(),
        nextWeek.getDate(),
        11,
        30,
        0
      ), // Next week at 11:30 AM
      endTime: new Date(
        nextWeek.getFullYear(),
        nextWeek.getMonth(),
        nextWeek.getDate(),
        12,
        30,
        0
      ), // Next week at 12:30 PM (60 min)
      notes: "Dealing with exam anxiety - BSCpE 3B",
      room: null,
      student: {
        user: {
          id: "mock-student-5",
          name: "Carlos Reyes",
          email: "carlos.reyes@example.com",
          section: "B",
          program: "BSCpE",
          year: 3,
        },
      },
    },
    {
      id: "mock-6",
      studentId: "mock-student-6",
      counselorId: "mock-counselor-1",
      status: "Approved" as AppointmentStatus,
      createdAt: new Date(),
      focus: "Academic Planning",
      hadCounselingBefore: true,
      sessionPreference: "InPerson" as any,
      urgencyLevel: 2,
      startTime: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        11,
        45,
        0
      ), // Today at 11:45 AM
      endTime: new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        12,
        15,
        0
      ), // Today at 12:15 PM (30 min)
      notes: "Course selection for next semester - BSF 2A",
      room: "Room 105",
      student: {
        user: {
          id: "mock-student-6",
          name: "Lisa Chen",
          email: "lisa.chen@example.com",
          section: "B",
          program: "BSIE",
          year: 2,
        },
      },
    },
  ];

  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  //add delay to simulate network request
  await new Promise((resolve) => setTimeout(resolve, 500));

  return appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.startTime);
    return appointmentDate >= startDate && appointmentDate <= endDate;
  });
}
