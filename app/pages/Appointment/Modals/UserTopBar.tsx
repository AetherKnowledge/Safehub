import StatusBadge from "@/app/components/Table/StatusBadge";
import UserImage from "@/app/components/UserImage";
import { AppointmentStatus } from "@/app/generated/prisma/browser";
import Link from "next/link";
import { AiOutlineMessage } from "react-icons/ai";
import { IoCallOutline } from "react-icons/io5";
import { useCallPopup } from "../../Chats/ChatBox/CallPopupProvider";

export type UserTopBarProps = {
  userEmail: string;
  userName?: string;
  userImgSrc?: string;
  chatId?: string;
  appointmentStatus?: AppointmentStatus;
  onClickUserImage?: () => void;
};

const UserTopBar = ({
  userName,
  userEmail,
  userImgSrc,
  chatId,
  onClickUserImage,
  appointmentStatus,
}: UserTopBarProps) => {
  const { initiateCall } = useCallPopup();

  const handleInitiateCall = () => {
    if (!chatId) return;

    initiateCall(chatId);
  };

  return (
    <div className="flex flex-row gap-5 items-center text-left w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/5 p-6 pb-4">
      <UserImage
        src={userImgSrc || undefined}
        name={userName || userEmail.split("@")[0] || "Unknown"}
        width={20}
        bordered
        borderWidth={3}
        onClick={onClickUserImage}
      />

      <div className="flex flex-col w-full">
        <p className="text-xs font-semibold">Appointment with...</p>
        <p className="font-semibold">
          {userName || userEmail.split("@")[0] || "Unknown"}
        </p>
        <p className="text-xs font-semibold text-base-content/70 text-wrap">
          {userEmail || "Unknown"}
        </p>
        <div className="flex flex-row gap-2 mt-2">
          {chatId && (
            <>
              <Link
                className="btn btn-primary rounded-full p-0 h-8 w-8"
                href={`/user/chats/${chatId}`}
              >
                <AiOutlineMessage className="h-5 w-5" />
              </Link>
              <button
                type="button"
                className="btn btn-primary rounded-full p-0 h-8 w-8"
                onClick={handleInitiateCall}
              >
                <IoCallOutline className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
      {appointmentStatus && (
        <StatusBadge
          className="rounded-sm p-4 max-w-35 w-full text-center"
          status={appointmentStatus}
        />
      )}
    </div>
  );
};

export default UserTopBar;
