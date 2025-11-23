"use client";

import Collapse from "@/app/components/Collapse";
import Divider from "@/app/components/Divider";
import ModalBase from "@/app/components/Popup/ModalBase";

import { BuiltFormDataWithAnswers } from "@/app/components/Forms/EditableFormBuilder";
import { FormComponentBuilder } from "@/app/components/Forms/FormBuilder";
import { AppointmentStatus, SessionPreference } from "@/app/generated/prisma";
import { AppointmentData } from "@/app/pages/Appointment/AppointmentActions";
import MarkDoneButton from "@/app/pages/Appointment/AppointmentTable/MarkDoneButton";
import RejectButton from "@/app/pages/Appointment/AppointmentTable/RejectButton";
import RescheduleButton from "@/app/pages/Appointment/AppointmentTable/RescheduleButton";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import { useState } from "react";
import ApproveButton from "./ApproveButton";
import CloseButton from "./CloseButton";
import FollowUpButton from "./FollowUpButton";
import SessionSummaryButton from "./SessionSummaryButton";
import StudentDetailsPopup, { StudentDetails } from "./StudentDetailsPopup";
import UserTopBar from "./UserTopBar";

const ViewAppointmentButton = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="flex flex-row btn btn-info gap-1 justify-center items-center btn-sm h-8"
        onClick={() => setShowModal(true)}
      >
        View
      </button>
      {showModal && (
        <ViewModal
          appointment={appointment}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

const ActionButtons = ({ appointment }: { appointment: AppointmentData }) => {
  let buttons: React.ReactNode[] = [];

  switch (appointment.status) {
    case AppointmentStatus.Pending:
      buttons = [
        <RejectButton key="reject" appointment={appointment} />,
        <RescheduleButton key="resched" appointment={appointment} />,
      ];

      if (!appointment.parentId) {
        buttons.push(<ApproveButton key="approve" appointment={appointment} />);
      }

      break;

    case AppointmentStatus.Approved:
      buttons = [
        <RejectButton key="reject" appointment={appointment} />,
        <MarkDoneButton key="done" appointment={appointment} />,
      ];
      break;

    case AppointmentStatus.Completed:
      buttons = [
        <SessionSummaryButton key="summary" appointment={appointment} />,
      ];

      if (!appointment.followUpId) {
        buttons.push(
          <FollowUpButton key="followup" appointment={appointment} />
        );
      }
      break;

    default:
      return null;
  }

  const isSingle = buttons.length === 1;

  return (
    <>
      {buttons.map((btn, i) => (
        <div key={i} className={isSingle ? "ml-auto" : ""}>
          {btn}
        </div>
      ))}
    </>
  );
};

export const PreferenceBadge = ({
  preference,
}: {
  preference: SessionPreference;
}) => {
  return (
    <div className="badge bg-gray-100 text-black rounded-sm">
      {preference === SessionPreference.Either && "Either"}
      {preference === SessionPreference.InPerson && "In-Person Meeting"}
      {preference === SessionPreference.Online && "Online Meeting"}
    </div>
  );
};

export const ViewModal = ({
  appointment,
  onClose,
}: {
  appointment: AppointmentData;
  onClose: () => void;
}) => {
  const [showStudentDetails, setShowStudentDetails] = useState(false);

  const formDataWithAnswers = JSON.parse(
    JSON.stringify(appointment.appointmentData)
  ) as BuiltFormDataWithAnswers;

  return (
    <ModalBase onClose={onClose}>
      <div className="bg-base-100 p-0 rounded-lg shadow-lg text-base-content max-w-2xl flex-1 flex flex-col">
        <CloseButton onClick={onClose} />
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-3">
            <UserTopBar
              userName={appointment.student.user.name || undefined}
              userEmail={appointment.student.user.email}
              userImgSrc={appointment.student.user.image || undefined}
              appointmentStatus={appointment.status}
              onClickUserImage={() => setShowStudentDetails(true)}
              chatId={appointment.chatId}
            />
            {showStudentDetails && (
              <StudentDetailsPopup
                appointment={appointment}
                onClose={() => setShowStudentDetails(false)}
              />
            )}
            <div className="flex flex-col text-sm p-3 gap-3">
              <p>
                Appointment Schedule:{" "}
                <span className="font-light">
                  {formatDateDisplay(appointment.startTime)}{" "}
                  {formatTime(appointment.startTime)}
                </span>
              </p>
              <div className="flex flex-row gap-2 items-center">
                Mode:
                <PreferenceBadge preference={appointment.sessionPreference} />
              </div>
              {appointment.status === AppointmentStatus.Cancelled && (
                <p>
                  Reason for Cancellation:{" "}
                  <span className="font-light">
                    {appointment.cancellationReason || "No reason provided"}
                  </span>
                </p>
              )}
              <Divider />
              <Collapse
                id="collapse-appointment-details"
                title="Appointment Details"
              >
                <div className="flex flex-col py-5 gap-5">
                  {formDataWithAnswers.questions.components.map((component) => (
                    <FormComponentBuilder
                      key={component.props.name}
                      component={component}
                      answer={formDataWithAnswers.answers[component.props.name]}
                      readOnly
                    />
                  ))}
                </div>
              </Collapse>
              <Divider />
              <Collapse id="collapse-student-details" title="Student Details">
                <StudentDetails user={appointment.student.user} />
              </Collapse>
              <Divider />
            </div>
          </div>
          <div className="flex justify-between px-3 pt-3">
            <ActionButtons appointment={appointment} />
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default ViewAppointmentButton;
