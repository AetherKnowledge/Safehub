"use client";

import Collapse from "@/app/components/Collapse";
import Divider from "@/app/components/Divider";
import { BuiltFormDataWithAnswers } from "@/app/components/Forms/EditableFormBuilder";
import { FormComponentBuilder } from "@/app/components/Forms/FormBuilder";
import ModalBase from "@/app/components/Popup/ModalBase";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppointmentData } from "../AppointmentActions";
import ActionsTakenButton from "./ActionsTakenButton";
import ApproveButton from "./ApproveButton";
import CancelButton from "./CancelButton";
import CloseButton from "./CloseButton";
import EditButton from "./EditButton";
import EvaluationButton from "./EvaluationButton";
import FollowUpButton from "./FollowUpButton";
import MarkDoneButton from "./MarkDoneButton";
import RescheduleButton from "./RescheduleButton";
import UserDetailsPopup, { StudentDetails } from "./UserDetailsPopup";
import UserTopBar from "./UserTopBar";
import { PreferenceBadge } from "./ViewAppointmentButton";

const ViewModal = ({
  appointment,
  onClose,
}: {
  appointment: AppointmentData;
  onClose: () => void;
}) => {
  const [showUserDetails, setShowUserDetails] = useState(false);
  const session = useSession();
  const userType = session?.data?.user.type || UserType.Student;
  const studentData = appointment.student;
  const counselorData = appointment.counselor;

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
              userName={
                userType === UserType.Student
                  ? counselorData.user.name ||
                    counselorData.user.email.split("@")[0] ||
                    "Counselor"
                  : studentData.user.name ||
                    studentData.user.email.split("@")[0] ||
                    "Student"
              }
              userEmail={
                userType === UserType.Student
                  ? counselorData.user.email
                  : studentData.user.email
              }
              userImgSrc={
                userType === UserType.Student
                  ? counselorData.user.image || undefined
                  : studentData.user.image || undefined
              }
              appointmentStatus={appointment.status}
              onClickUserImage={() => setShowUserDetails(true)}
              chatId={appointment.chatId}
            />
            {showUserDetails && (
              <UserDetailsPopup
                user={
                  userType === UserType.Student
                    ? studentData.user
                    : counselorData.user
                }
                onClose={() => setShowUserDetails(false)}
              >
                {userType === UserType.Student && (
                  <StudentDetails user={studentData.user} />
                )}
              </UserDetailsPopup>
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
                      answerOnly
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
          <div className="flex flex-col items-center sm:flex-row justify-between px-3 pt-3 gap-2">
            {userType === UserType.Student ? (
              <StudentButtons appointment={appointment} />
            ) : (
              <CounselorButtons appointment={appointment} />
            )}
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

const CounselorButtons = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  let buttons: React.ReactNode[] = [];

  switch (appointment.status) {
    case AppointmentStatus.Pending:
      buttons = [<RescheduleButton key="resched" appointment={appointment} />];

      if (!appointment.parentId) {
        buttons.push(<ApproveButton key="approve" appointment={appointment} />);
      }

      break;

    case AppointmentStatus.Approved:
      buttons = [<MarkDoneButton key="done" appointment={appointment} />];
      break;

    case AppointmentStatus.Completed:
      buttons = [
        <ActionsTakenButton key="summary" appointment={appointment} />,
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

  if (appointment.evaluationData) {
    buttons.push(
      <EvaluationButton
        appointment={appointment}
        userType={UserType.Counselor}
      />
    );
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

const StudentButtons = ({ appointment }: { appointment: AppointmentData }) => {
  let buttons: React.ReactNode[] = [];

  switch (appointment.status) {
    case AppointmentStatus.Pending:
      // If has parentId -> show ApproveButton
      if (appointment.parentId) {
        buttons.push(<ApproveButton key="approve" appointment={appointment} />);
      } else {
        buttons.push(<EditButton key="edit" appointment={appointment} />);
      }

      buttons.push(<CancelButton key="cancel" appointment={appointment} />);
      break;

    case AppointmentStatus.Approved:
      if (!appointment.parentId) {
        buttons.push(<EditButton key="edit" appointment={appointment} />);
      }

      buttons.push(<CancelButton key="cancel" appointment={appointment} />);
      break;

    case AppointmentStatus.Completed:
      buttons = [
        <EvaluationButton
          key="eval"
          appointment={appointment}
          userType={UserType.Student}
        />,
        <ActionsTakenButton key="summary" appointment={appointment} />,
      ];
      break;

    default:
      return null;
  }

  return (
    <>
      {buttons.map((btn, i) => (
        <div key={i}>{btn}</div>
      ))}
    </>
  );
};

export const ViewModalPopup = ({
  appointment,
}: {
  appointment: AppointmentData;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const handleClose = () => {
    setIsOpen(false);
    router.push("/user/appointments");
  };

  return (
    <>
      {isOpen && <ViewModal appointment={appointment} onClose={handleClose} />}
    </>
  );
};

export default ViewModal;
