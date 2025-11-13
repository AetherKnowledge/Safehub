"use client";
import {
  Appointment,
  AppointmentStatus,
  SessionPreference,
  UserType,
} from "@/app/generated/prisma";
import { NewAppointmentData, UpdateAppointmentData } from "@/lib/schemas";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import DatePickerSelector from "@/app/components/Input/Date/DatePickerSelector";

import TimePickerSelector from "@/app/components/Input/Date/TimePickerSelector";
import {
  getTimeFromDate,
  setTimeToDate,
  Time,
  TimePeriod,
} from "@/app/components/Input/Date/utils";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  createNewAppointment,
  updateAppointment,
} from "@/app/pages/Appointment/AppointmentActions";
import { useSession } from "next-auth/react";

const Booking = ({ appointment }: { appointment?: Appointment }) => {
  const statusPopup = usePopup();
  const router = useRouter();
  const session = useSession();

  const [q1, setQ1] = useState(appointment?.focus || "");
  const [q2, setQ2] = useState<boolean | null>(
    appointment?.hadCounselingBefore ?? null
  );
  const [q3, setQ3] = useState<SessionPreference | "">(
    appointment?.sessionPreference || ""
  );
  const [q4, setQ4] = useState<number | "">(appointment?.urgencyLevel || "");
  const [q5, setQ5] = useState<Date | null>(appointment?.startTime || null);
  const [q6, setQ6] = useState(appointment?.notes || "");

  async function handleSubmit() {
    if (!q1 || q2 === null || !q3 || !q4 || !q5) {
      alert("Please fill out all required fields.");
      return;
    }

    const scheduleUpdated =
      session.data?.user.type === UserType.Student &&
      appointment &&
      appointment.status !== AppointmentStatus.Pending &&
      appointment.startTime.toISOString() !== q5?.toISOString();

    const confirmation = scheduleUpdated
      ? await statusPopup.showYesNo(
          "Changing the appointment time will reset its status to 'Pending' and requires counselor re-approval. Do you want to proceed?"
        )
      : true;

    if (!confirmation) {
      return;
    }

    statusPopup.showLoading("Submitting your appointment...");

    const formData: NewAppointmentData = {
      focus: q1,
      hadCounselingBefore: q2,
      sessionPreference: q3,
      urgencyLevel: q4,
      startTime: q5,
      notes: q6,
    };

    console.log(formData);
    if (appointment) {
      await updateAppointment(
        appointment.id,
        formData as UpdateAppointmentData
      );
      statusPopup.showSuccess(
        "Appointment updated successfully!",
        "/user/appointments"
      );
    } else {
      const response = await createNewAppointment(formData);
      if (response?.error) {
        statusPopup.showError(response.error);
        return;
      }

      statusPopup.showSuccess(
        "Appointment created successfully!",
        "/user/appointments"
      );
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col bg-base-100 shadow-br rounded max-w-2xl  items-center justify-center h-[87.5vh] p-5">
        <div className="flex flex-col gap-10 h-full overflow-y-auto">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">
              1. What brings you in today, and what would you like to focus on?
            </p>
            <textarea
              className="textarea textarea-ghost border border-base-content/10 focus:outline-base-content/20 focus:ring-0 w-[98%] ml-1 h-16 bg-base-200"
              placeholder="type your response here..."
              value={q1}
              onChange={(e) => setQ1(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">
              2. Have you attended counseling before, or would this be your
              first time?
            </p>
            <div className="flex flex-row gap-10">
              <label className="label">
                <input
                  checked={q2 === true}
                  type="radio"
                  name="q2"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ2(true)}
                />
                <p className="text-base-content">Yes</p>
              </label>
              <label className="label">
                <input
                  checked={q2 === false}
                  type="radio"
                  name="q2"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ2(false)}
                />
                <p className="text-base-content">No</p>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">
              3. Do you prefer in-person sessions, online sessions, or either?
            </p>
            <div className="flex flex-row gap-10">
              <label className="label">
                <input
                  checked={q3 === SessionPreference.InPerson}
                  type="radio"
                  name="q3"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ3(SessionPreference.InPerson)}
                />
                <p className="text-base-content">In-person</p>
              </label>
              <label className="label">
                <input
                  checked={q3 === SessionPreference.Online}
                  type="radio"
                  name="q3"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ3(SessionPreference.Online)}
                />
                <p className="text-base-content">Online</p>
              </label>
              <label className="label">
                <input
                  checked={q3 === SessionPreference.Either}
                  type="radio"
                  name="q3"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ3(SessionPreference.Either)}
                />
                <p className="text-base-content">Either</p>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">
              4. How urgent is your concern? From 1 to 5, 5 is the highest
              urgency.
            </p>
            <div className="flex flex-row gap-10">
              <label className="label">
                <input
                  checked={q4 === 1}
                  type="radio"
                  name="q4"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ4(1)}
                />
                <p className="text-base-content">1</p>
              </label>
              <label className="label">
                <input
                  checked={q4 === 2}
                  type="radio"
                  name="q4"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ4(2)}
                />
                <p className="text-base-content">2</p>
              </label>
              <label className="label">
                <input
                  checked={q4 === 3}
                  type="radio"
                  name="q4"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ4(3)}
                />
                <p className="text-base-content">3</p>
              </label>
              <label className="label">
                <input
                  checked={q4 === 4}
                  type="radio"
                  name="q4"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ4(4)}
                />
                <p className="text-base-content">4</p>
              </label>
              <label className="label">
                <input
                  checked={q4 === 5}
                  type="radio"
                  name="q4"
                  className="checkbox rounded bg-base-200"
                  onChange={() => setQ4(5)}
                />
                <p className="text-base-content">5</p>
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">5. Pick a schedule.</p>
            <div className="flex flex-wrap gap-5 items-center text-center">
              <DatePickerSelector
                name="date"
                value={q5 || undefined}
                onChange={(date) => setQ5(date)}
                cannotPickPast
              />
              <TimePickerSelector
                name="time"
                value={q5 ? getTimeFromDate(q5) : undefined}
                min={{ hour: 8, minute: 0, period: TimePeriod.AM }}
                max={{ hour: 8, minute: 0, period: TimePeriod.PM }}
                onChange={(time: Time) => {
                  setQ5((prev) => {
                    if (!prev) return prev;
                    return setTimeToDate(new Date(prev), time);
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">
              6. Is there anything important I should know before our session?
            </p>
            <textarea
              className="textarea textarea-ghost border border-base-content/10 focus:outline-base-content/20 focus:ring-0 w-[98%] ml-1 h-16 bg-base-200"
              placeholder="type your response here..."
              value={q6}
              onChange={(e) => setQ6(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <Link
            className="btn btn-error w-40 self-end mt-5"
            href="/user/appointments"
          >
            Cancel
          </Link>
          <button
            className="btn btn-primary w-40 self-end mt-5"
            onClick={handleSubmit}
          >
            {appointment ? "Save" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Booking;
