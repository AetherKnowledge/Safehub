"use client";
import { UserType } from "@/app/generated/prisma";
import { useState } from "react";
import DefaultLoading from "../../DefaultLoading";
import { AppointmentData } from "../AppointmentActions";
import Feedback from "../Feedback";
import { Actions } from "./AppointmentsTable";
import ApproveButton from "./ApproveButton";
import CancelButton from "./CancelButton";
import EditButton from "./EditButton";

type ActionBoxProps = {
  actions: Actions[];
  appointment: AppointmentData;
  userType: UserType;
};

const ActionBox = ({ actions, appointment, userType }: ActionBoxProps) => {
  const [loading, setLoading] = useState(false);

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
              appointmentId={appointment.id}
              setLoading={setLoading}
            />
          )}

          {actions.includes(Actions.CANCEL) && (
            <CancelButton
              appointmentId={appointment.id}
              setLoading={setLoading}
            />
          )}
        </>
      )}
    </>
  );
};

export default ActionBox;
