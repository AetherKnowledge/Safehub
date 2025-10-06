"use client";
import ErrorScreen from "@/app/components/ErrorScreen";
import LoadingScreen from "@/app/components/LoadingScreen";
import SuccessScreen from "@/app/components/SuccessScreen";
import { SessionPreference } from "@/app/generated/prisma";
import { NewAppointmentData } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createNewAppointment } from "../AppointmentsActions";
import DatePickerSelector from "./DatePickerSelector";

const Booking = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorScreen, setShowErrorScreen] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [q1, setQ1] = useState("");
  const [q2, setQ2] = useState<boolean | null>(null);
  const [q3, setQ3] = useState<SessionPreference | "">("");
  const [q4, setQ4] = useState<number | "">("");
  const [q5, setQ5] = useState<Date | null>(null);
  const [q6, setQ6] = useState("");

  function handleSubmit() {
    if (!q1 || q2 === null || !q3 || !q4 || !q5) {
      alert("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    const formData: NewAppointmentData = {
      focus: q1,
      hadCounselingBefore: q2,
      sessionPreference: q3,
      urgencyLevel: q4,
      startTime: q5,
      notes: q6,
    };

    createNewAppointment(formData)
      .then(() => {
        setLoading(false);
        setShowSuccessScreen(true);
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage(error.message || "An error occurred");
        setShowErrorScreen(true);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      {loading && <LoadingScreen />}
      {showErrorScreen && (
        <ErrorScreen
          message={errorMessage}
          onClose={() => setShowErrorScreen(false)}
        />
      )}
      {showSuccessScreen && (
        <SuccessScreen onClose={() => router.push("/user/appointments")} />
      )}
      <div className="flex items-center justify-center">
        <div className="flex flex-col bg-base-100 shadow-br rounded max-w-2xl  items-center justify-center max-h-[85vh] overflow-y-auto p-5">
          <div className="flex flex-col gap-10 h-full">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">
                1. What brings you in today, and what would you like to focus
                on?
              </p>
              <textarea
                className="textarea textarea-ghost border border-base-content/10 focus:outline-base-content/20 focus:ring-0 w-full h-16 bg-base-200"
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
                    type="radio"
                    name="q2"
                    className="checkbox rounded bg-base-200"
                    onChange={() => setQ2(true)}
                  />
                  <p className="text-base-content">Yes</p>
                </label>
                <label className="label">
                  <input
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
                    type="radio"
                    name="q3"
                    className="checkbox rounded bg-base-200"
                    onChange={() => setQ3(SessionPreference.InPerson)}
                  />
                  <p className="text-base-content">In-person</p>
                </label>
                <label className="label">
                  <input
                    type="radio"
                    name="q3"
                    className="checkbox rounded bg-base-200"
                    onChange={() => setQ3(SessionPreference.Online)}
                  />
                  <p className="text-base-content">Online</p>
                </label>
                <label className="label">
                  <input
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
                    type="radio"
                    name="q4"
                    className="checkbox rounded bg-base-200"
                    onChange={() => setQ4(1)}
                  />
                  <p className="text-base-content">1</p>
                </label>
                <label className="label">
                  <input
                    type="radio"
                    name="q4"
                    className="checkbox rounded bg-base-200"
                    onChange={() => setQ4(2)}
                  />
                  <p className="text-base-content">2</p>
                </label>
                <label className="label">
                  <input
                    type="radio"
                    name="q4"
                    className="checkbox rounded bg-base-200"
                    onChange={() => setQ4(3)}
                  />
                  <p className="text-base-content">3</p>
                </label>
                <label className="label">
                  <input
                    type="radio"
                    name="q4"
                    className="checkbox rounded bg-base-200"
                    onChange={() => setQ4(4)}
                  />
                  <p className="text-base-content">4</p>
                </label>
                <label className="label">
                  <input
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
              <DatePickerSelector onChange={(date) => setQ5(date)} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-lg">
                6. Is there anything important I should know before our session?
              </p>
              <textarea
                className="textarea textarea-ghost border border-base-content/10 focus:outline-base-content/20 focus:ring-0 w-full h-16 bg-base-200"
                placeholder="type your response here..."
                value={q6}
                onChange={(e) => setQ6(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <button
              className="btn btn-error w-40 self-end mt-5"
              onClick={() => router.back()}
            >
              Back
            </button>
            <button
              className="btn btn-primary w-40 self-end mt-5"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Booking;
