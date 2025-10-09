import { AppointmentData } from "../AppointmentActions";
import AppointmentBox from "./AppointmentBox";
import { TIME_SLOTS } from "./WeeklyCalendarUtils";

const DayContainer = async ({
  weekDates,
  appointments,
}: {
  weekDates: Date[];
  appointments: AppointmentData[];
}) => {
  return (
    <div className="flex-1 flex">
      {weekDates.map((date, dayIndex) => {
        const appointmentsForDay = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.startTime);
          return appointmentDate.toDateString() === date.toDateString();
        });
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <div
            key={dayIndex}
            className={`flex-1 relative border-l border-base-content/30 ${
              isToday ? "bg-primary/20" : ""
            }`}
            style={{ height: `${TIME_SLOTS.length * 120}px` }}
          >
            {/* Hour lines */}
            {TIME_SLOTS.map((_, timeIndex) => (
              <div
                key={timeIndex}
                className="absolute w-full text-center"
                style={{ top: `${timeIndex * 120}px`, height: "120px" }}
              >
                {/* Half-hour line */}
                <div className="absolute w-full" style={{ top: "60px" }} />
              </div>
            ))}

            {appointmentsForDay.map((appointment, index) => {
              return <AppointmentBox key={index} appointment={appointment} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export const DayContainerLoading = ({ weekDates }: { weekDates: Date[] }) => {
  return (
    <div className="flex-1 flex">
      {weekDates.map((date, dayIndex) => {
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <div
            key={dayIndex}
            className={`flex-1 relative border-l border-base-content/30 ${
              isToday ? "bg-primary/20" : ""
            }`}
            style={{ height: `${TIME_SLOTS.length * 120}px` }}
          >
            {/* Hour lines */}
            {TIME_SLOTS.map((_, timeIndex) => (
              <div
                key={timeIndex}
                className="absolute w-full text-center"
                style={{ top: `${timeIndex * 120}px`, height: "120px" }}
              >
                {/* Half-hour line */}
                <div className="absolute w-full" style={{ top: "60px" }} />
              </div>
            ))}

            <AppointmentBoxLoading />
          </div>
        );
      })}
    </div>
  );
};

export const AppointmentBoxLoading = () => {
  return (
    <div className="absolute top-2 left-2 text-xs text-gray-400">
      Loading...
    </div>
  );
};

export default DayContainer;
