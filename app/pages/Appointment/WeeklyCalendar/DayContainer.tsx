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
    <div className="flex-1 flex h-full">
      {weekDates.map((date, dayIndex) => {
        const appointmentsForDay = appointments.filter((appointment) => {
          const appointmentDate = new Date(appointment.startTime);
          return appointmentDate.toDateString() === date.toDateString();
        });
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <div
            key={dayIndex}
            className={`flex-1 relative h-full border-l border-base-content/30 ${
              isToday ? "bg-primary/20" : ""
            }`}
          >
            {/* Hour and half-hour grid lines using percentages */}
            {TIME_SLOTS.map((_, timeIndex) => {
              const topPercent = (timeIndex / (TIME_SLOTS.length - 1)) * 100;
              const isFirst = timeIndex === 0;
              const isHalfHour = timeIndex % 2 === 1;
              return (
                <div
                  key={timeIndex}
                  className={`absolute left-0 right-0 border-transparent ${
                    isHalfHour
                      ? "border-base-content/10" // lighter for half-hour
                      : "border-base-content/20" // slightly darker for full hour
                  }`}
                  style={{ top: `${topPercent}%` }}
                />
              );
            })}

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
    <div className="flex-1 flex h-full">
      {weekDates.map((date, dayIndex) => {
        const isToday = date.toDateString() === new Date().toDateString();

        return (
          <div
            key={dayIndex}
            className={`flex-1 relative h-full border-l border-base-300 transition-colors ${
              isToday ? "bg-primary/5" : ""
            }`}
          >
            {/* Hour and half-hour grid lines using percentages */}
            {TIME_SLOTS.map((_, timeIndex) => {
              const topPercent = (timeIndex / (TIME_SLOTS.length - 1)) * 100;
              const isFirst = timeIndex === 0;
              const isHalfHour = timeIndex % 2 === 1;
              return (
                <div
                  key={timeIndex}
                  className={`absolute left-0 right-0 ${
                    isHalfHour
                      ? "border-t border-base-300/30" // lighter for half-hour
                      : "border-t border-base-300/50" // slightly darker for full hour
                  }`}
                  style={{ top: `${topPercent}%` }}
                />
              );
            })}

            <AppointmentBoxLoading />
          </div>
        );
      })}
    </div>
  );
};

export const AppointmentBoxLoading = () => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="loading loading-spinner loading-sm text-primary"></span>
      <span className="text-xs text-base-content/50">
        Loading appointments...
      </span>
    </div>
  );
};

export default DayContainer;
