import { getAppointmentById } from "@/app/components/Appointments/AppointmentActions";
import Booking from "@/app/components/Appointments/Booking";
import ErrorPopup from "@/app/components/Popup/ErrorPopup";

const page = async ({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) => {
  const { appointmentId } = await params;
  const appointment = await getAppointmentById(appointmentId);

  return (
    <>
      {appointment ? (
        <Booking appointment={appointment} />
      ) : (
        <ErrorPopup
          message="Appointment not found"
          redirectTo="/user/appointments"
        />
      )}
    </>
  );
};

export default page;
