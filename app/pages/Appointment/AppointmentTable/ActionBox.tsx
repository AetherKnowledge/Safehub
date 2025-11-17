"use client";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DefaultLoading from "../../../components/DefaultLoading";
import { usePopup } from "../../../components/Popup/PopupProvider";
import {
  AppointmentData,
  updateAppointmentStatus,
} from "../AppointmentActions";
import { Actions } from "./AppointmentsTable";
import ApproveButton from "./ApproveButton";
import CancelButton from "./CancelButton";
import CancelButtonStudent from "./CancelButtonStudent";
import EditButton from "./EditButton";
import FeedbackButton from "./FeedbackButton";
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

    const result = await updateAppointmentStatus({
      appointmentId: appointment.id,
      status: appointmentStatus,
    });

    if (!result.success) {
      setLoading(false);
      statusPopup.showError(result.message || "Failed to update appointment.");
      return;
    }

    setLoading?.(false);
    statusPopup.showSuccess(
      `Appointment ${appointmentStatus.toLowerCase()} successfully`
    );
    router.refresh();
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
            <FeedbackButton appointment={appointment} />
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
          {actions.includes(Actions.REJECT) && (
            <CancelButton
              onCancel={() => handleUpdate(AppointmentStatus.Rejected)}
            />
          )}
          {actions.includes(Actions.CANCEL) && (
            <CancelButtonStudent appointment={appointment} />
          )}
        </>
      )}
    </>
  );
};

export default ActionBox;
