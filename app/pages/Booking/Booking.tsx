"use client";
import {
  Appointment,
  AppointmentStatus,
  UserType,
} from "@/app/generated/prisma";

import FormsBuilder, {
  QuestionBox,
  QuestionType,
} from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { TimePeriod } from "@/app/components/Input/Date/utils";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  createNewAppointment,
  updateAppointment,
} from "@/app/pages/Appointment/AppointmentActions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const header: FormsHeaderProps = {
  title: "Book a Counseling Appointment",
  description:
    "Please fill out the following form to schedule your counseling appointment.",
};

const Booking = ({ appointment }: { appointment?: Appointment }) => {
  const statusPopup = usePopup();
  const session = useSession();

  console.log("Editing appointment:", appointment);

  const questions: QuestionBox[] = [
    {
      questionType: QuestionType.TEXTAREA,
      props: {
        name: "focus",
        legend:
          "What brings you in today, and what would you like to focus on?",
        placeholder: "Type your response here...",
        defaultValue: appointment?.focus || "",
        required: true,
      },
      version: "1",
    },
    {
      questionType: QuestionType.RADIO,
      props: {
        name: "hadCounselingBefore",
        required: true,
        defaultValue: appointment?.hadCounselingBefore
          ? "hasAttended"
          : "firstTime",
        legend:
          "Have you attended counseling before, or would this be your first time?",
        options: [
          { value: "firstTime", label: "This is my first time" },
          { value: "hasAttended", label: "I have attended before" },
        ],
      },
      version: "1",
    },
    {
      questionType: QuestionType.RADIO,
      props: {
        name: "sessionPreference",
        required: true,
        legend: "Do you prefer in-person sessions, online sessions, or either?",
        defaultValue: appointment?.sessionPreference ?? undefined,
        options: [
          { value: "InPerson", label: "In-person sessions" },
          { value: "Online", label: "Online sessions" },
          { value: "Either", label: "Either" },
        ],
      },
      version: "1",
    },
    {
      questionType: QuestionType.RADIO,
      props: {
        name: "urgencyLevel",
        legend:
          "How urgent is your concern? From 1 to 5, 5 is the highest urgency.",
        required: true,
        defaultValue: appointment?.urgencyLevel?.toString(),
        options: [
          { value: "1", label: "1" },
          { value: "2", label: "2" },
          { value: "3", label: "3" },
          { value: "4", label: "4" },
          { value: "5", label: "5" },
        ],
      },
      version: "1",
    },
    {
      questionType: QuestionType.DATETIME,
      props: {
        name: "startTime",
        legend: "Pick Schedule.",
        defaultValue: appointment?.startTime,
        minTime: { hour: 8, minute: 0, period: TimePeriod.AM },
        maxTime: { hour: 8, minute: 0, period: TimePeriod.PM },
        required: true,
      },
      version: "1",
    },
    {
      questionType: QuestionType.TEXTAREA,
      props: {
        name: "notes",
        legend: "Any additional notes or comments?",
        placeholder: "Type your response here...",
        defaultValue: appointment?.notes || "",
      },
      version: "1",
    },
  ];

  async function handleSubmit(formData: FormData) {
    const scheduleUpdated =
      session.data?.user.type === UserType.Student &&
      appointment &&
      appointment.status !== AppointmentStatus.Pending &&
      appointment.startTime.toISOString() !==
        new Date(formData.get("startTime") as string)?.toISOString();

    const confirmation = scheduleUpdated
      ? await statusPopup.showYesNo(
          "Changing the appointment time will reset its status to 'Pending' and requires counselor re-approval. Do you want to proceed?"
        )
      : true;

    if (!confirmation) {
      return;
    }

    statusPopup.showLoading("Submitting your appointment...");

    console.log(formData);
    if (appointment) {
      const response = await updateAppointment(appointment.id, formData);
      if (!response.success) {
        statusPopup.showError(response.message);
        return;
      }
      statusPopup.showSuccess(
        "Appointment updated successfully!",
        "/user/appointments"
      );
    } else {
      const response = await createNewAppointment(formData);
      if (!response.success) {
        statusPopup.showError(response.message);
        return;
      }

      statusPopup.showSuccess(
        "Appointment created successfully!",
        "/user/appointments"
      );
    }
  }

  return (
    <FormsBuilder
      header={header}
      questions={questions}
      onSubmit={handleSubmit}
      onBack={() => redirect("/user/appointments")}
    />
  );
};

export default Booking;
