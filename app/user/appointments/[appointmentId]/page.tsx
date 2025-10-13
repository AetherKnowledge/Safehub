import ErrorPopup from "@/app/components/Popup/ErrorPopup";
import { getAppointmentById } from "@/app/pages/Appointment/AppointmentActions";
import Booking from "@/app/pages/Booking";

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
