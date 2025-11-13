"use client";

import DatePickerSelector from "@/app/components/Input/Date/DatePickerSelector";
import TimePickerSelector from "@/app/components/Input/Date/TimePickerSelector";
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
  updateAppointment,
} from "../AppointmentActions";
import { UpdateAppointmentData } from "../schema";

const RescheduleBooking = ({
  appointment,
  onClose,
}: {
  appointment: AppointmentData;
  onClose: () => void;
}) => {
  const [startTime, setStartTime] = useState<Date | null>(
    appointment?.startTime || null
  );
  const [endTime, setEndTime] = useState<Date | null>(
    appointment?.endTime || null
  );
  const statusPopup = usePopup();
  const router = useRouter();

  async function confirmReschedule() {
    if (!startTime) return;

    onClose();
    statusPopup.showLoading("Updating appointment...");

    const formData: UpdateAppointmentData = {
      startTime,
      endTime: endTime || addMinutes(startTime, 60),
    };

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

    updateAppointment(appointment.id, formData)
      .then(() => {
        statusPopup.showSuccess("Appointment updated successfully!");
        router.refresh();
      })
      .catch((error) => {
        statusPopup.showError(error.message || "An error occurred");
      });
  }

  return (
    <ModalBase>
      <div className="flex flex-col bg-base-100 rounded-lg p-4 gap-4">
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-2xl">Pick a new schedule</p>
          <div className="flex flex-col gap-5 items-center text-center">
            <DatePickerSelector
              name="date"
              value={startTime || undefined}
              onChange={(date) => setStartTime(date)}
              cannotPickPast
            />
            <TimePickerSelector
              name="start-time"
              value={startTime ? getTimeFromDate(startTime) : undefined}
              min={{ hour: 8, minute: 0, period: TimePeriod.AM }}
              max={{ hour: 7, minute: 0, period: TimePeriod.PM }}
              onChange={(time: Time) => {
                setStartTime((prev) => {
                  if (!prev) return prev;
                  return setTimeToDate(new Date(prev), time);
                });
              }}
            />
            <TimePickerSelector
              name="end-time"
              value={endTime ? getTimeFromDate(endTime) : undefined}
              min={
                startTime
                  ? getTimeFromDate(addMinutes(startTime, 60))
                  : { hour: 8, minute: 0, period: TimePeriod.AM }
              }
              max={{ hour: 8, minute: 0, period: TimePeriod.PM }}
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
