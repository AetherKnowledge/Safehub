import { getAppointmentsForDate } from "@/app/pages/Appointment/AppointmentActions";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

// This isnt a server action because server actions dont support aborting requests yet
export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const date = new Date((await params).date);

  const filteredAppointments = await getAppointmentsForDate(date);

  if (filteredAppointments.length === 0) {
    return new NextResponse(JSON.stringify([]), { status: 200 });
  }
  return new NextResponse(JSON.stringify(filteredAppointments), {
    status: 200,
  });
}
