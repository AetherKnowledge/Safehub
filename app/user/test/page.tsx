import { getAppointments } from "@/app/pages/Appointment/AppointmentActions";
import ViewAppointmentButton from "@/app/pages/Appointment/AppointmentTable/ViewAppointmentButton";

const Test = async () => {
  async function wew() {
    "use server";
    // await testAction();
  }

  const appointments = await getAppointments();

  return (
    <>
      {/* <button className="btn" onClick={wew}>
        Test Action
      </button> */}
      <div className="flex-1 flex flex-row">
        <ViewAppointmentButton appointment={appointments[1]} />
      </div>
    </>
  );
};

export default Test;
