import { Fragment, Suspense } from "react";
import { Await } from "react-router";
import { getAppointmentsForDateRange } from "../AppointmentsActions";
import DayContainer, { DayContainerLoading } from "./DayContainer";
import { DAYS, TIME_SLOTS, getWeekDates } from "./WeeklyCalendarUtils";

const WeeklyCalendar = ({ date }: { date: Date }) => {
  const weekDates = getWeekDates(date);

  return (
    <div className="bg-base-100 shadow-br rounded-lg">
      {/* Calendar Grid */}
      <div className="flex border border-base-content/30 bg-base-100 overflow-hidden">
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
      <div className="flex border border-t-0 border-base-content/30 rounded-b-lg">
        {/* Time column */}
        <div className="w-25 flex-shrink-0">
          {TIME_SLOTS.map((timeSlot, timeIndex) => (
            <Fragment key={timeSlot}>
              {timeIndex % 2 === 0 && (
                <div
                  key={timeSlot}
                  className={`flex flex-col text-xs text-gray-600 text-center ${
                    timeIndex < TIME_SLOTS.length - 1
                      ? "border-b h-[240px]"
                      : "h-[120px]"
                  } border-base-content/30 justify-center`}
                >
                  <p className="h-[113px]">{timeSlot}</p>
                  <p className="h-[127px] text-[10px] text-base-content/50">
                    {timeIndex < TIME_SLOTS.length - 1
                      ? TIME_SLOTS[timeIndex + 1]
                      : ""}
                  </p>
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <Suspense
          key={weekDates.map((date) => date.toDateString()).join(",")}
          fallback={<DayContainerLoading weekDates={weekDates} />}
        >
          <Await
            resolve={getAppointmentsForDateRange(
              weekDates[0],
              weekDates[weekDates.length - 1]
            )}
            children={(appointments) => (
              <DayContainer weekDates={weekDates} appointments={appointments} />
            )}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default WeeklyCalendar;
