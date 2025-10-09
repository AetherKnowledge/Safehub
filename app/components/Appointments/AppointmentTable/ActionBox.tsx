"use client";
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
};

const ActionBox = ({ actions, appointment }: ActionBoxProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <DefaultLoading />
      ) : (
        <>
          {actions.includes(Actions.EDIT) && (
            <EditButton appointmentId={appointment.id} />
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
