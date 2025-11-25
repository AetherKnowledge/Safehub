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
import { FaRegEdit } from "react-icons/fa";
import {
  AppointmentData,
  checkForConflictingDate,
  rescheduleAppointment,
} from "../AppointmentActions";

const RescheduleButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [showModal, setShowModal] = useState(false);
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

    statusPopup.showLoading("Updating appointment...");

    if (!startTime) {
      statusPopup.showError("Please select a valid start time.");
      return;
    }

    if (!endTime) {
      statusPopup.showError("Please select a valid end time.");
      return;
    }

    const endDateTime = new Date(startTime);
    endDateTime.setHours(endTime.getHours());
    endDateTime.setMinutes(endTime.getMinutes());

    const conflicts = await checkForConflictingDate(
      startTime,
      endDateTime,
      appointment.id
    );

    if (conflicts && conflicts.length > 0) {
      const confirm = await statusPopup.showYesNo(
        `The selected time conflicts with ${conflicts.length} existing appointment(s). Do you still want to proceed?`
      );
      if (!confirm) return;

      statusPopup.showLoading("Updating appointment...");
    }

    const result = await rescheduleAppointment(
      appointment.id,
      startTime,
      endDateTime
    );

    if (!result.success) {
      statusPopup.showError(result.message || "Failed to update appointment.");
      return;
    }

    statusPopup.showSuccess("Appointment updated successfully!");
    setShowModal(false);
    router.refresh();
  }

  return (
    <>
      <button
        className="flex flex-row btn gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowModal(true)}
      >
        <FaRegEdit className="w-3 h-3" />
        Reschedule
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="flex flex-col bg-base-100 rounded-lg p-4 gap-4 text-base-content">
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-2xl">Pick a new schedule</p>
              <div className="flex flex-col gap-3 items-center text-center">
                <DateTimeSelector
                  name={`startTime-reschedule-${appointment.id}`}
                  horizontal
                  minDate="now"
                  minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
                  maxTime={{ hour: 7, minute: 0, period: TimePeriod.PM }}
                  defaultValue={appointment?.startTime}
                  onChange={(date) => {
                    setStartTime(date);
                  }}
                  required
                />
                <TimeSelector
                  name={`endTime-reschedule-${appointment.id}`}
                  value={endTime ? getTimeFromDate(endTime) : undefined}
                  minTime={
                    startTime
                      ? getTimeFromDate(addMinutes(startTime, 60))
                      : { hour: 8, minute: 0, period: TimePeriod.AM }
                  }
                  maxTime={{ hour: 8, minute: 0, period: TimePeriod.PM }}
                  onChange={(time: Time) => {
                    setEndTime(setTimeToDate(new Date(), time));
                  }}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <button
                className="btn btn-error mt-4"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className="btn btn-primary mt-4"
                onClick={confirmReschedule}
              >
                Confirm
              </button>
            </div>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default RescheduleButton;
