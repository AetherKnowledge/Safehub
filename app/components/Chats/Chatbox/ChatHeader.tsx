"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { IoIosCall } from "react-icons/io";
import { useCalling } from "../../Socket/useCalling";
import VideoContainer from "../../Video/VideoContainer";

const ChatHeader = ({ chatId }: { chatId: string }) => {
  const [
    calling,
    initiateCall,
    answerCall,
    rejectCall,
    leaveCall,
    localStream,
    peers,
  ] = useCalling(chatId);
  const session = useSession();
  const [showPopup, setShowPopup] = useState(false);
  const [videoPopup, setVideoPopup] = useState(false);

  useEffect(() => {
    if (calling && calling.callerId !== session.data?.user.id) {
      console.log("Incoming call:", calling);
      setShowPopup(true); // Show the popup when there is an incoming call
    } else if (calling && calling.callerId === session.data?.user.id) {
      console.log("Outgoing call initiated:", calling);
      setVideoPopup(true); // Show the video popup when initiating a call
    } else {
      setShowPopup(false); // Hide the popup when there is no call
      setVideoPopup(false); // Hide the video popup when there is no call
    }
  }, [calling]);

  const handleInitiateCall = () => {
    initiateCall(chatId);
    setVideoPopup(true); // Show the video popup when initiating a call
  };

  const handleAnswer = () => {
    answerCall();
    setShowPopup(false); // Close the popup
    setVideoPopup(true); // Show the video popup when answering a call
  };

  const handleReject = () => {
    rejectCall();
    setShowPopup(false); // Close the popup
  };

  const handleLeaveCall = () => {
    leaveCall();
    setVideoPopup(false);
  };

  useEffect(() => {
    if (peers && localStream) {
      console.log("Setting up peer connection with local stream");
    }
  }, [peers, localStream]);

  return (
    <div className="p-4 border-b-1 border-none rounded-t-2xl text-base-content bg-base-100">
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-10 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">Incoming Call</h3>
            <p className="mb-4">{calling?.callerName || "Unknown Caller"}</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleAnswer}
              >
                Answer
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
      {videoPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-bold mb-4">Video Call</h3>
            <VideoContainer
              stream={localStream}
              isLocalStream={true}
              isOnCall={true}
              onEndCall={handleLeaveCall}
              peers={peers}
            />
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between">
        <h2 className="text-3xl font-bold text-primary">Chats</h2>
        <div className="flex flex-row gap-5">
          <IoIosCall
            className="text-2xl text-primary cursor-pointer hover:text-secondary transition-colors mt-2"
            onClick={handleInitiateCall}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
