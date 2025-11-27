"use client";

import Collapse from "@/app/components/Collapse";
import { BuiltFormDataWithAnswers } from "@/app/components/Forms/EditableFormBuilder";
import { FormComponentBuilder } from "@/app/components/Forms/FormBuilder";
import ModalBase from "@/app/components/Popup/ModalBase";
import { AppointmentStatus, UserType } from "@/app/generated/prisma";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppointmentData, getAppointmentHistory } from "../AppointmentActions";
import ActionsTakenButton from "./ActionsTakenButton";
import ApproveButton from "./ApproveButton";
import CancelButton from "./CancelButton";
import CloseButton from "./CloseButton";
import DidNotAttendButton from "./DidNotAttendButton";
import DidNotAttendReasonButton from "./DidNotAttendReasonButton";
import EditButton from "./EditButton";
import EvaluationButton from "./EvaluationButton";
import FollowUpButton from "./FollowUpButton";
import MarkDoneButton from "./MarkDoneButton";
import NotesButton from "./NotesButton";
import RescheduleButton from "./RescheduleButton";
import UserDetailsPopup, { StudentDetails } from "./UserDetailsPopup";
import UserTopBar from "./UserTopBar";
import { PreferenceBadge } from "./ViewAppointmentButton";

const ViewModal = ({
  appointment: initialAppointment,
  onClose,
}: {
  appointment: AppointmentData;
  onClose: () => void;
}) => {
  const [appointment, setAppointment] = useState(initialAppointment);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [history, setHistory] = useState<AppointmentData[]>([]);

  const [showUserDetails, setShowUserDetails] = useState(false);

  const session = useSession();
  const userType = session?.data?.user.type || UserType.Student;
  const studentData = appointment.student;
  const counselorData = appointment.counselor;

  const formDataWithAnswers = JSON.parse(
    JSON.stringify(appointment.appointmentData)
  ) as BuiltFormDataWithAnswers;

  useEffect(() => {
    async function fetchHistory() {
      setHistoryLoading(true);
      const result = await getAppointmentHistory(appointment.id);
      if (!result.success || !result.data) {
        return;
      }

      setHistory(result.data);
      setHistoryLoading(false);
    }
    fetchHistory();
  }, []);

  // Update appointment if initialAppointment changes
  useEffect(() => {
    setHistory((prevHistory) => {
      const updatedHistory = prevHistory.map((appt) =>
        appt.id === initialAppointment.id ? initialAppointment : appt
      );
      return updatedHistory;
    });
    if (initialAppointment.id === appointment.id) {
      setAppointment(initialAppointment);
    }
  }, [initialAppointment]);

  return (
    <ModalBase onClose={onClose}>
      <div className="bg-base-100 p-0 rounded-2xl shadow-2xl text-base-content max-w-3xl flex-1 flex flex-col overflow-hidden">
        <CloseButton onClick={onClose} />

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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="flex flex-col gap-6">
            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                <p className="text-xs text-base-content/60 mb-1 font-medium uppercase tracking-wide">
                  Schedule
                </p>
                <p className="text-sm font-semibold">
                  {formatDateDisplay(appointment.startTime)}
                </p>
                <p className="text-sm text-base-content/80">
                  {formatTime(appointment.startTime)}
                </p>
              </div>

              <div className="bg-base-200 rounded-xl p-4 border border-base-300">
                <p className="text-xs text-base-content/60 mb-1 font-medium uppercase tracking-wide">
                  Mode
                </p>
                <PreferenceBadge preference={appointment.sessionPreference} />
              </div>
            </div>

            {appointment.status === AppointmentStatus.Cancelled && (
              <div className="bg-error/10 border border-error/20 rounded-xl p-4">
                <p className="text-xs text-error/80 mb-1 font-medium uppercase tracking-wide">
                  Cancellation Reason
                </p>
                <p className="text-sm text-base-content/90">
                  {appointment.cancellationReason || "No reason provided"}
                </p>
              </div>
            )}

            {appointment.status === AppointmentStatus.DidNotAttend && (
              <div className="bg-error/10 border border-error/20 rounded-xl p-4">
                <p className="text-xs text-error/80 mb-1 font-medium uppercase tracking-wide">
                  Not Attending Reason
                </p>
                <p className="text-sm text-base-content/90">
                  {appointment.didNotAttendReason || "No reason provided"}
                </p>
              </div>
            )}

            {/* Collapsible Sections */}
            <div className="flex flex-col gap-4">
              <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
                <Collapse id="collapse-appointment-history" title="History">
                  <div className="flex flex-col gap-3 p-4">
                    {historyLoading ? (
                      <div className="flex justify-center py-8">
                        <span className="loading loading-spinner loading-md text-primary"></span>
                      </div>
                    ) : history.length === 0 ? (
                      <p className="text-center text-base-content/60 py-4">
                        No history available
                      </p>
                    ) : (
                      history.map((item) => (
                        <HistoryItem
                          key={item.id}
                          appointment={item}
                          selected={item.id === appointment.id}
                          onSelect={(id) => {
                            const selected = history.find(
                              (appt) => appt.id === id
                            );
                            if (selected) {
                              setAppointment(selected);
                            }
                          }}
                        />
                      ))
                    )}
                  </div>
                </Collapse>
              </div>

              <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
                <Collapse
                  id="collapse-appointment-details"
                  title="Appointment Details"
                >
                  <div className="flex flex-col gap-4 p-4">
                    {formDataWithAnswers.questions.components.map(
                      (component) => (
                        <FormComponentBuilder
                          key={component.props.name}
                          component={component}
                          answer={
                            formDataWithAnswers.answers[component.props.name]
                          }
                          answerOnly
                        />
                      )
                    )}
                  </div>
                </Collapse>
              </div>

              <div className="bg-base-200 rounded-xl border border-base-300 overflow-hidden">
                <Collapse id="collapse-student-details" title="Student Details">
                  <div className="p-4">
                    <StudentDetails user={appointment.student.user} />
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-base-200 border-t border-base-300 px-6 py-4">
          <div className="flex flex-col items-center sm:flex-row justify-end gap-3">
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

const HistoryItem = ({
  appointment,
  selected,
  onSelect,
}: {
  appointment: AppointmentData;
  selected: boolean;
  onSelect: (id: string) => void;
}) => {
  return (
    <div
      className={`flex flex-row justify-between items-center p-3 rounded-lg border transition-all ${
        selected
          ? "bg-primary/10 border-primary/30 shadow-sm"
          : "bg-base-100 border-base-300 hover:bg-base-200"
      }`}
    >
      <div>
        <p className="font-semibold text-sm">
          {formatDateDisplay(appointment.startTime)}
        </p>
        <p className="text-xs text-base-content/60">
          {formatTime(appointment.startTime)}
        </p>
      </div>
      <button
        className={`btn btn-sm h-8 ${
          selected ? "btn-primary" : "btn-ghost btn-outline"
        }`}
        onClick={() => onSelect(appointment.id)}
        disabled={selected}
      >
        {selected ? "Current" : "View"}
      </button>
    </div>
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
      buttons = [
        <RescheduleButton key="resched" appointment={appointment} />,
        <MarkDoneButton key="done" appointment={appointment} />,
      ];

      buttons.push(<DidNotAttendButton key="dna" appointment={appointment} />);

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
    case AppointmentStatus.DidNotAttend:
      buttons = [<FollowUpButton key="followup" appointment={appointment} />];
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

  buttons.push(<NotesButton key="notes" appointment={appointment} />);

  const isSingle = buttons.length === 1;

  return (
    <div
      className={`flex flex-wrap gap-2 ${
        isSingle ? "ml-auto" : "w-full sm:w-auto"
      }`}
    >
      {buttons.map((btn, i) => (
        <div key={i}>{btn}</div>
      ))}
    </div>
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
    case AppointmentStatus.DidNotAttend:
      buttons = [
        <DidNotAttendReasonButton key="dnaReason" appointment={appointment} />,
      ];
      break;

    default:
      return null;
  }

  return (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      {buttons.map((btn, i) => (
        <div key={i}>{btn}</div>
      ))}
    </div>
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
