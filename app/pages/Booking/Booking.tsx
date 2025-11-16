"use client";
import {
  Appointment,
  AppointmentStatus,
  UserType,
} from "@/app/generated/prisma";

import FormsBuilder from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  createNewAppointment,
  updateAppointment,
} from "@/app/pages/Appointment/AppointmentActions";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { bookingQuestions } from "../Appointment/Question";
import { AppointmentFormData } from "../Appointment/schema";

const header: FormsHeaderProps = {
  name: "bookingHeader",
  title: "Book a Counseling Appointment",
  description:
    "Please fill out the following form to schedule your counseling appointment.",
};

const Booking = ({ appointment }: { appointment?: Appointment }) => {
  const statusPopup = usePopup();
  const session = useSession();

  const appointmentData = JSON.parse(
    appointment?.appointmentData as string
  ) as AppointmentFormData;
  const questions = appointmentData?.questions || bookingQuestions;

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
      components={questions}
      defaultValues={appointmentData?.answers}
      onSubmit={handleSubmit}
      onBack={() => redirect("/user/appointments")}
    />
  );
};

export default Booking;
