"use client";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultLoading from "../../DefaultLoading";
import { usePopup } from "../../Popup/PopupProvider";
import {
  AppointmentData,
  updateAppointmentStatus,
} from "../AppointmentActions";
import Feedback from "../Feedback";
import { Actions } from "./AppointmentsTable";
import ApproveButton from "./ApproveButton";
import CancelButton from "./CancelButton";
import EditButton from "./EditButton";
import MarkDoneButton from "./MarkDoneButton";

type ActionBoxProps = {
  actions: Actions[];
  appointment: AppointmentData;
  userType: UserType;
};

const ActionBox = ({ actions, appointment, userType }: ActionBoxProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const statusPopup = usePopup();

  const handleUpdate = async (appointmentStatus: AppointmentStatus) => {
    setLoading(true);
    statusPopup.showLoading("Updating appointment...");

    await updateAppointmentStatus(appointment.id, appointmentStatus)
      .then(() => {
        setLoading?.(false);
        statusPopup.showSuccess(
          `Appointment ${appointmentStatus.toLowerCase()} successfully`
        );
        router.refresh();
      })
      .catch((error) => {
        setLoading?.(false);
        statusPopup.showError(error.message || "Failed to update appointment.");
      });
  };

  return (
    <>
      {loading ? (
        <DefaultLoading />
      ) : (
        <>
          {actions.includes(Actions.EDIT) && (
            <EditButton appointment={appointment} userType={userType} />
          )}
          {actions.includes(Actions.FEEDBACK) && (
            <Feedback appointment={appointment} />
          )}
          {actions.includes(Actions.APPROVE) && (
            <ApproveButton
              onClick={() => handleUpdate(AppointmentStatus.Approved)}
            />
          )}
          {actions.includes(Actions.MARK_DONE) && (
            <MarkDoneButton
              onClick={() => handleUpdate(AppointmentStatus.Completed)}
            />
          )}
          {actions.includes(Actions.CANCEL) && (
            <CancelButton
              appointmentStatus={appointment.status}
              onClick={() => handleUpdate(AppointmentStatus.Rejected)}
            />
          )}
        </>
      )}
    </>
  );
};

export default ActionBox;
