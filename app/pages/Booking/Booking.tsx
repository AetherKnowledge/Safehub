"use client";
import {
  Appointment,
  AppointmentStatus,
  SessionPreference,
  UserType,
} from "@/app/generated/prisma";

import FormsBuilder, {
  QuestionBox,
  QuestionType,
} from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { DatePickerSelectorProps } from "@/app/components/Input/Date/DatePickerSelector";
import { TimePickerSelectorProps } from "@/app/components/Input/Date/TimePickerSelector";
import { TimePeriod } from "@/app/components/Input/Date/utils";
import { RadioBoxProps } from "@/app/components/Input/RadioBox";
import { TextAreaProps } from "@/app/components/Input/TextArea";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  createNewAppointment,
  updateAppointment,
} from "@/app/pages/Appointment/AppointmentActions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  NewAppointmentData,
  UpdateAppointmentData,
} from "../Appointment/schema";

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
      } as TextAreaProps,
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
      } as RadioBoxProps,
      version: "1",
    },
    {
      questionType: QuestionType.RADIO,
      props: {
        name: "sessionPreference",
        required: true,
        legend: "Do you prefer in-person sessions, online sessions, or either?",
        defaultValue: appointment?.sessionPreference,
        options: [
          { value: "InPerson", label: "In-person sessions" },
          { value: "Online", label: "Online sessions" },
          { value: "Either", label: "Either" },
        ],
      } as RadioBoxProps,
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
      } as RadioBoxProps,
      version: "1",
    },
    {
      questionType: QuestionType.DATE,
      props: {
        name: "schedule",
        legend: "Pick a schedule.",
        value: appointment?.startTime,
        cannotPickPast: true,
        required: true,
      } as DatePickerSelectorProps,
      version: "1",
    },
    {
      questionType: QuestionType.TIME,
      props: {
        name: "time",
        legend: "Pick a time.",
        defaultValue: appointment
          ? (() => {
              const date = new Date(appointment.startTime);
              let hours = date.getHours();
              const minutes = date.getMinutes();
              const period = hours >= 12 ? "PM" : "AM";
              hours = hours % 12 || 12; // Convert to 12-hour format
              return `${hours}:${minutes
                .toString()
                .padStart(2, "0")} ${period}`;
            })()
          : undefined,
        max: { hour: 8, minute: 0, period: TimePeriod.PM },
        required: true,
      } as TimePickerSelectorProps,
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
    const startSchedule = new Date(formData.get("schedule") as string);
    const timeString = formData.get("time") as string;
    const [timePart, period] = timeString.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }
    startSchedule.setHours(hours, minutes, 0, 0);

    const parsedData: NewAppointmentData | UpdateAppointmentData = {
      focus: formData.get("focus") as string,
      hadCounselingBefore:
        (formData.get("hadCounselingBefore") as string) === "hasAttended",
      sessionPreference: formData.get("sessionPreference") as SessionPreference,
      urgencyLevel: Number(formData.get("urgencyLevel") as string),
      startTime: startSchedule,
      notes: (formData.get("notes") as string) || undefined,
    };

    const scheduleUpdated =
      session.data?.user.type === UserType.Student &&
      appointment &&
      appointment.status !== AppointmentStatus.Pending &&
      appointment.startTime.toISOString() !==
        new Date(formData.get("schedule") as string)?.toISOString();

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
      await updateAppointment(
        appointment.id,
        parsedData as UpdateAppointmentData
      );
      statusPopup.showSuccess(
        "Appointment updated successfully!",
        "/user/appointments"
      );
    } else {
      const response = await createNewAppointment(
        parsedData as NewAppointmentData
      );
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
    <FormsBuilder
      header={header}
      questions={questions}
      onSubmit={handleSubmit}
      onBack={() => redirect("/user/appointments")}
    />
  );
};

export default Booking;
