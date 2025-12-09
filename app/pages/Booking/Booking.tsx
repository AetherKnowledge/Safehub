"use client";
import {
  Appointment,
  AppointmentStatus,
  UserType,
} from "@/app/generated/prisma/browser";

import { BuiltFormData } from "@/app/components/Forms/EditableFormBuilder";
import FormBuilder from "@/app/components/Forms/FormBuilder";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import {
  createNewAppointment,
  updateAppointment,
} from "@/app/pages/Appointment/AppointmentActions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AppointmentFormData } from "../Appointment/schema";

const Booking = ({
  appointment,
  form,
}: {
  appointment?: Appointment;
  form?: BuiltFormData;
}) => {
  const statusPopup = usePopup();
  const session = useSession();
  const router = useRouter();

  const appointmentData = appointment
    ? (JSON.parse(
        JSON.stringify(appointment.appointmentData)
      ) as AppointmentFormData)
    : undefined;

  if (appointment && !appointmentData?.questions) {
    statusPopup.showError(
      "Failed to load appointment data. Please try again later."
    );
    router.push("/user/appointments");
    return null;
  }

  if (!appointment && !form) {
    statusPopup.showError(
      "Failed to load booking form. Please try again later."
    );
    return null;
  }

  const questions = appointment ? appointmentData?.questions : form;

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
    <FormBuilder
      form={questions!}
      defaultValues={appointmentData?.answers}
      onSubmit={handleSubmit}
      backHref="/user/appointments"
    />
  );
};

export default Booking;
