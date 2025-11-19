"use client";

import Collapse from "@/app/components/Collapse";
import Divider from "@/app/components/Divider";
import ModalBase from "@/app/components/Popup/ModalBase";

import StatusBadge from "@/app/components/Table/StatusBadge";
import UserImage from "@/app/components/UserImage";
import { AppointmentStatus, SessionPreference } from "@/app/generated/prisma";
import { AppointmentData } from "@/app/pages/Appointment/AppointmentActions";
import MarkDoneButton from "@/app/pages/Appointment/AppointmentTable/MarkDoneButton";
import RejectButton from "@/app/pages/Appointment/AppointmentTable/RejectButton";
import RescheduleButton from "@/app/pages/Appointment/AppointmentTable/RescheduleButton";
import { formatDateDisplay, formatTime } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";
import { useCallPopup } from "../../Chats/ChatBox/CallPopupProvider";
import ApproveButton from "./ApproveButton";
import CloseButton from "./CloseButton";
import FollowUpButton from "./FollowUpButton";
import SessionSummaryButton from "./SessionSummaryButton";

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
    <div className="badge rounded-sm">
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
  const { initiateCall } = useCallPopup();

  const handleInitiateCall = () => {
    if (!appointment.chatId) return;

    initiateCall(appointment.chatId);
  };

  return (
    <ModalBase onClose={onClose}>
      <div className="bg-base-100 p-0 rounded-lg shadow-lg text-base-content max-w-2xl flex-1 flex flex-col">
        <CloseButton onClick={onClose} />
        <div className="p-6 pt-0">
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-5 items-center">
              <UserImage
                src={appointment.student.user.image || undefined}
                name={appointment.student.user.name || "Unknown"}
                width={20}
                bordered
                borderWidth={3}
              />
              <div className="flex flex-col flex-1">
                <p className="text-xs font-semibold">Appointment with...</p>
                <p className="font-semibold">
                  {appointment.student.user.name || "Unknown"}
                </p>
                <p className="text-xs font-semibold text-base-content/70">
                  {appointment.student.user.email || "Unknown"}
                </p>
                <div className="flex flex-row gap-2 mt-2">
                  <Link
                    className="btn btn-primary rounded-full p-0 h-8 w-8"
                    href={`/user/chats/${appointment.chatId}`}
                  >
                    <AiOutlineMessage className="h-5 w-5" />
                  </Link>
                  <button
                    className="btn btn-primary rounded-full p-0 h-8 w-8"
                    onClick={handleInitiateCall}
                  >
                    <IoCallOutline className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <StatusBadge
                className="rounded-sm p-4"
                status={appointment.status}
              />
            </div>
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
              <Collapse title="Appointment Details">
                {/* Add appointment details content here */}
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
