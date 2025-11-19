"use client";

import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import TimeSelector from "@/app/components/Input/Date/TimeSelector";
import {
  Time,
  TimePeriod,
  getTimeFromDate,
  setTimeToDate,
} from "@/app/components/Input/Date/utils";
import TextArea from "@/app/components/Input/TextArea";
import ModalBase from "@/app/components/Popup/ModalBase";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { addMinutes } from "@/lib/utils";
import { useState } from "react";
import { FaRegCheckCircle, FaRegClipboard } from "react-icons/fa";
import {
  AppointmentData,
  checkForConflictingDate,
  createFollowUpAppointment,
} from "../AppointmentActions";
import CloseButton from "./CloseButton";

const FollowUpButton = ({ appointment }: { appointment: AppointmentData }) => {
  const [showModal, setShowModal] = useState(false);
  const [startTime, setStartTime] = useState<Date | undefined>(
    appointment?.startTime
  );
  const [endTime, setEndTime] = useState<Date | undefined>(
    appointment?.endTime || undefined
  );
  const [reason, setReason] = useState<string>(
    appointment?.followUpReason || ""
  );

  const statusPopup = usePopup();

  async function handleSubmit() {
    if (!startTime) return;
    statusPopup.showLoading("Creating follow up appointment...");

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

    const result = await createFollowUpAppointment({
      appointmentId: appointment.id,
      startTime,
      endTime: endTime || addMinutes(startTime, 60),
      reason,
    });

    if (!result.success) {
      statusPopup.showError(
        result.message || "Failed to create follow up appointment."
      );
      return;
    }

    statusPopup.showSuccess("Follow up appointment created successfully.");
  }

  return (
    <>
      <button
        className="flex flex-row btn btn-primary gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowModal(true)}
      >
        <FaRegClipboard className="w-4 h-4" />
        Follow Up Appointment
      </button>
      {showModal && (
        <ModalBase onClose={() => setShowModal(false)}>
          <div className="bg-base-100 p-0 rounded-lg shadow-lg text-base-content max-w-2xl flex-1 flex flex-col">
            <CloseButton onClick={() => setShowModal(false)} />
            <div className="flex flex-col items-center justify-center text-center p-6 pt-0 gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold text-primary">
                  Follow Up Appointment
                </h2>
                <p className="font-light">
                  Answer the form to schedule a follow-up appointment for the
                  student you counseled.
                </p>
              </div>
              <div className="flex flex-col w-full gap-4">
                <input
                  type="hidden"
                  name="appointmentId"
                  value={appointment.id}
                  readOnly
                />
                <TextArea
                  name="reason"
                  legend="Reason:"
                  placeholder="Enter session reason here..."
                  defaultValue={reason}
                  required
                  readonly={appointment.followUpId ? true : false}
                  onChange={setReason}
                />
                <DateTimeSelector
                  name="startTime"
                  minDate="now"
                  minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
                  maxTime={{ hour: 7, minute: 0, period: TimePeriod.PM }}
                  defaultValue={appointment?.startTime}
                  onChange={(date) => setStartTime(date)}
                />
                <TimeSelector
                  name="endTime"
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
              {!appointment.followUpId && (
                <button
                  className="flex flex-row btn btn-primary gap-2 justify-center items-center text-center"
                  onClick={handleSubmit}
                >
                  <FaRegCheckCircle className="w-4 h-4" />
                  Submit
                </button>
              )}
            </div>
          </div>
        </ModalBase>
      )}
    </>
  );
};

export default FollowUpButton;
