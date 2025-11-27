"use client";

import VideoContainer from "@/app/components/Video/VideoContainer";
import { CallStatus } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { useCalling } from "../../../../lib/socket/hooks/useCalling";
import { getChatInfo } from "../ChatsActions";
import InitiateCallPopup from "./InitiateCallPopup";
import RingingPopup from "./RingingPopup";

// #TODO: Fix bug when rejecting call videoPopup shows up for a split second

interface CallPopupContextType {
  initiateCall: (chatId: string) => void;
  setVideoPopup: (value: boolean) => void;
  setRingingPopup: (value: boolean) => void;
}

export const CallPopupContext = createContext<CallPopupContextType | undefined>(
  undefined
);

export const useCallPopup = () => {
  const context = useContext(CallPopupContext);
  if (context === undefined) {
    throw new Error("useCallPopup must be used within a CallPopupProvider");
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

const CallPopup = ({ children }: Props) => {
  const {
    currentCall,
    initiateCall,
    answerCall,
    rejectCall,
    leaveCall,
    localStream,
    peers,
  } = useCalling();

  const callPopupContextValue: CallPopupContextType = {
    setVideoPopup: (value: boolean) => {
      setVideoPopup(value);
    },
    setRingingPopup: (value: boolean) => {
      setRingingPopup(value);
    },
    initiateCall: async (chatId: string) => {
      const chatInfo = await getChatInfo(chatId);
      if (!chatInfo) {
        console.error("No chat information found");
        return;
      }

      if (!session?.data?.user || session.data?.user.deactivated) {
        console.error("No user information found");
        return;
      }

      console.log(chatInfo.recipients);

      // filter out self from recipients
      const recipients = chatInfo.recipients.filter(
        (recipient) => recipient.id !== session?.data?.user?.id
      );

      initiateCall(chatId, recipients);
    },
  };

  const session = useSession();
  const [ringingPopup, setRingingPopup] = useState(false);
  const [videoPopup, setVideoPopup] = useState(false);
  const [initiatingCall, setInitiatingCall] = useState(false);

  useEffect(() => {
    if (currentCall && currentCall.callerId !== session.data?.user.id) {
      console.log("Incoming call:", currentCall);
      setRingingPopup(true); // Show the popup when there is an incoming call
    } else if (
      currentCall &&
      currentCall.callerId === session.data?.user.id &&
      (currentCall.status === CallStatus.Pending ||
        currentCall.status === CallStatus.No_Answer)
    ) {
      console.log("Outgoing call initiated:", currentCall);
      setInitiatingCall(true);
    } else if (
      currentCall &&
      currentCall.callerId === session.data?.user.id &&
      currentCall.status === CallStatus.Accepted
    ) {
      console.log("Outgoing call accepted:", currentCall);
      setVideoPopup(true);
    } else {
      setInitiatingCall(false);
      setRingingPopup(false); // Hide the popup when there is no call
      setVideoPopup(false); // Hide the video popup when there is no call
    }
  }, [currentCall, currentCall?.status]);

  function resetPopups() {
    setInitiatingCall(false);
    setRingingPopup(false);
    setVideoPopup(false);
  }

  const handleAnswerCall = () => {
    if (!currentCall) return;

    answerCall();
    resetPopups();
    setVideoPopup(true);
  };

  const handleRejectCall = () => {
    if (!currentCall) return;

    rejectCall();
    resetPopups();
  };

  const handleLeaveCall = () => {
    if (!currentCall) return;

    leaveCall();
    resetPopups();
  };

  useEffect(() => {
    if (peers && localStream) {
      console.log("Setting up peer connection with local stream");
    }
  }, [peers, localStream]);

  return (
    <>
      {ringingPopup && (
        <RingingPopup
          callerName={currentCall?.callerName || "Unknown Caller"}
          callerImage={currentCall?.callerImage}
          onAnswer={handleAnswerCall}
          onReject={handleRejectCall}
        />
      )}
      {initiatingCall && (
        <InitiateCallPopup
          recipients={currentCall?.recipients || []}
          chatName={currentCall?.chatName}
          onCancel={handleLeaveCall}
          status={currentCall?.status || CallStatus.Pending}
        />
      )}
      {videoPopup && (
        <VideoContainer
          stream={localStream}
          isLocalStream={true}
          onEndCall={handleLeaveCall}
          peers={peers}
        />
      )}
      <CallPopupContext.Provider value={callPopupContextValue}>
        {children}
      </CallPopupContext.Provider>
    </>
  );
};

export default CallPopup;
