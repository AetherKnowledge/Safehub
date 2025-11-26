import { AppointmentStatus } from "@/app/generated/prisma";
import { Suspense } from "react";
import { Await } from "react-router";
import {
  AppointmentData,
  getAppointmentsForDateRange,
} from "../AppointmentActions";
import DayContainer, { DayContainerLoading } from "./DayContainer";
import { DAYS, TIME_SLOTS, getWeekDates } from "./WeeklyCalendarUtils";

const WeeklyCalendar = ({ date }: { date: Date }) => {
  const weekDates = getWeekDates(date);

  return (
    <div className="bg-base-100 flex-1 min-h-0 rounded-lg flex flex-col">
      {/* Calendar Grid */}
      <div className="flex border border-base-content/30 bg-base-100 flex-shrink-0">
        <div className="w-25 flex-shrink-0 p-3"></div>{" "}
        {/* Empty cell for time column - matches body */}
        <div className="flex-1 flex">
          {DAYS.map((day, index) => {
            const date = weekDates[index];
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={day}
                className={`flex-1 p-3 text-center border-l border-base-content/30 ${
                  isToday ? "bg-primary" : ""
                }`}
              >
                <div
                  className={`font-medium text-sm ${
                    isToday ? "text-primary-content" : ""
                  }`}
                >
                  {day}
                </div>
                <div
                  className={`text-lg font-bold ${
                    isToday ? "text-primary-content" : ""
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Body */}
      <div className="flex flex-1 min-h-0 border border-t-0 border-base-content/30 rounded-b-lg overflow-hidden">
        <div className="flex w-full relative h-full">
          {/* Time column */}
          <div className="w-25 flex-shrink-0 relative h-full">
            {/* Horizontal grid lines in the time column for perfect alignment */}

            {/* Render a label for every time slot (hour + half-hour) aligned to grid */}
            {TIME_SLOTS.map((timeSlot, timeIndex) => {
              const topPercent = (timeIndex / (TIME_SLOTS.length - 1)) * 100;
              const isHalfHour = timeIndex % 2 === 1;
              const isFirst = timeIndex === 0;
              const isLast = timeIndex === TIME_SLOTS.length - 1;

              if (isLast) return null; // Skip last label to avoid overflow
              return (
                <div
                  key={`${timeSlot}-${timeIndex}`}
                  className={`flex flex-row items-center justify-center absolute left-0 right-0 text-center ${
                    isHalfHour
                      ? "text-[10px] text-base-content/50"
                      : "text-xs text-base-content/70"
                  }`}
                  style={{
                    top: `${topPercent}%`,
                    transform: isFirst ? "translateY(0%)" : "translateY(-50%)",
                  }}
                >
                  {timeSlot}
                  {/* Short right-edge tick line for hour marks only */}
                  {!isHalfHour && !isFirst && !isLast && (
                    <span
                      aria-hidden="true"
                      className="absolute right-0 top-1/2 -translate-y-1/2 h-px w-[5px] bg-base-content/40"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Day columns container - fills remaining space next to time column */}
          <div className="flex-1 h-full">
            <Suspense
              key={weekDates.map((date) => date.toDateString()).join(",")}
              fallback={<DayContainerLoading weekDates={weekDates} />}
            >
              <Await
                resolve={getAppointmentsForDateRange(
                  weekDates[0],
                  weekDates[weekDates.length - 1]
                )}
              >
                {(appointments) => (
                  <DayContainer
                    weekDates={weekDates}
                    appointments={filterAppointments(appointments)}
                  />
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

function filterAppointments(appointments: AppointmentData[]) {
  const filteredAppointments = appointments.filter((appointment) => {
    if (
      appointment.status === AppointmentStatus.Pending ||
      appointment.status === AppointmentStatus.Cancelled
    ) {
      return false;
    }
    return true;
  });
  return filteredAppointments;
}

export default WeeklyCalendar;
