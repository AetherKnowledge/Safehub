import { Suspense } from "react";
import { ThisWeeksAppointments } from "../Appointment/Student/AppointmentPage";

const UpcomingAppointments = () => {
  return (
    <div className="flex flex-col bg-linear-to-br from-base-100 to-base-200/50 rounded-xl p-5 gap-3 w-full flex-1 min-h-35 border border-base-content/5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-primary rounded-full"></div>
        <h2 className="font-bold text-lg">Upcoming Appointments</h2>
      </div>
      <div className="flex flex-row min-w-150 gap-5 w-full flex-1 min-h-20">
        <Suspense>
          <ThisWeeksAppointments />
        </Suspense>
      </div>
    </div>
  );
};

export default UpcomingAppointments;
