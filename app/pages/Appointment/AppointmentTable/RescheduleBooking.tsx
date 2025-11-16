"use client";

import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import TimeSelector from "@/app/components/Input/Date/TimeSelector";
import {
  getTimeFromDate,
  setTimeToDate,
  Time,
  TimePeriod,
} from "@/app/components/Input/Date/utils";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { addMinutes } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AppointmentData,
  checkForConflictingDate,
  rescheduleAppointment,
} from "../AppointmentActions";

const RescheduleBooking = ({
  appointment,
  onClose,
}: {
  appointment: AppointmentData;
  onClose: () => void;
}) => {
  const [startTime, setStartTime] = useState<Date | undefined>(
    appointment?.startTime
  );
  const [endTime, setEndTime] = useState<Date | undefined>(
    appointment?.endTime || undefined
  );
  const statusPopup = usePopup();
  const router = useRouter();

  async function confirmReschedule() {
    if (!startTime) return;

    onClose();
    statusPopup.showLoading("Updating appointment...");

    const conflicts = await checkForConflictingDate(
      startTime,
      endTime || addMinutes(startTime, 60),
      appointment.id
    );

    if (conflicts && conflicts.length > 0) {
      const confirm = await statusPopup.showYesNo(
        `The selected time conflicts with ${conflicts.length} existing appointment(s). Do you still want to proceed?`
      );
      if (!confirm) {
        statusPopup.hidePopup();
        return;
      }
    }

    const result = await rescheduleAppointment(
      appointment.id,
      startTime,
      endTime || addMinutes(startTime, 60)
    );

    if (!result.success) {
      statusPopup.showError(result.message || "Failed to update appointment.");
      return;
    }

    statusPopup.showSuccess("Appointment updated successfully!");
    router.refresh();
  }

  return (
    <ModalBase>
      <div className="flex flex-col bg-base-100 rounded-lg p-4 gap-4">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl">Pick a new schedule</p>
          <div className="flex flex-col gap-3 items-center text-center">
            <DateTimeSelector
              name="startTime"
              horizontal
              minDate="now"
              minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
              maxTime={{ hour: 7, minute: 0, period: TimePeriod.PM }}
              defaultValue={appointment?.startTime}
              onChange={(date) => setStartTime(date)}
            />
            <TimeSelector
              name="end-time"
              value={endTime ? getTimeFromDate(endTime) : undefined}
              minTime={
                startTime
                  ? getTimeFromDate(addMinutes(startTime, 60))
                  : { hour: 8, minute: 0, period: TimePeriod.AM }
              }
              maxTime={{ hour: 8, minute: 0, period: TimePeriod.PM }}
              onChange={(time: Time) => {
                setEndTime((prev) => {
                  if (!prev) return prev;
                  return setTimeToDate(new Date(prev), time);
                });
              }}
            />
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <button className="btn btn-error mt-4" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary mt-4" onClick={confirmReschedule}>
            Confirm
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default RescheduleBooking;
