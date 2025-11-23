"use client";

import { getUserName } from "@/lib/socket/hooks/CallActions";
import { PeerData } from "@/lib/socket/hooks/useCalling";
import React, { useCallback } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

interface Props {
  stream: MediaStream | null;
  isLocalStream: boolean;
  onEndCall?: () => void;
  peers?: PeerData[];
  visible?: boolean;
}

const VideoContainer = ({ stream, isLocalStream, onEndCall, peers }: Props) => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [isMicOn, setIsMicOn] = React.useState(true);
  const [isCameraOn, setIsCameraOn] = React.useState(true);

  const toggleMic = useCallback(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn((prev) => !prev);
    }
  }, [stream]);

  const toggleCamera = useCallback(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn((prev) => !prev);
    }
  }, [stream]);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`fixed inset-0 min-w-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-[9999]`}
    >
      <div className="max-h-[100vh] overflow-y-auto w-full items-center justify-center scrollbar-gutter-stable">
        <div className="flex-1 flex p-5 items-center justify-center">
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-base-100 p-6 rounded-lg shadow-lg text-center w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[1000px] mx-auto">
              <h3 className="text-xl font-bold mb-4 text-base-content">
                Video Call
              </h3>
              <div className="relative w-full mx-auto aspect-video rounded-lg border-2 border-gray-300">
                {/* Local stream video (small, top-right) */}
                {stream && (
                  <video
                    className="absolute top-2 right-2 w-24 h-16 sm:w-32 sm:h-24 md:w-48 md:h-36 rounded-lg border-2 border-gray-300 z-10 object-cover"
                    autoPlay
                    playsInline
                    muted={isLocalStream}
                    ref={videoRef}
                  />
                )}

                {/* Peer videos */}
                <div className="absolute inset-0 w-full h-full rounded-lg">
                  {peers && peers.length > 0 ? (
                    <div
                      className={`grid w-full h-full gap-1 ${
                        peers.length === 1
                          ? "grid-cols-1"
                          : peers.length === 2
                          ? "grid-cols-2"
                          : peers.length <= 4
                          ? "grid-cols-2 grid-rows-2"
                          : "grid-cols-3 grid-rows-2"
                      }`}
                    >
                      {peers.map((peer, index) => (
                        <PeerVideo
                          key={peer.userId || index}
                          peer={peer}
                          isMainView={peers.length === 1}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg">
                      <p className="text-base-content/70">
                        Waiting for other participants...
                      </p>
                    </div>
                  )}
                </div>

                {/* Control buttons */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
                  <button
                    className={`p-2 rounded-full transition-colors duration-300 cursor-pointer ${
                      isMicOn
                        ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                        : "bg-red-500 hover:bg-red-600 active:bg-red-700"
                    } text-white`}
                    onClick={toggleMic}
                  >
                    {isMicOn ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  </button>
                  <button
                    className={`p-2 rounded-full transition-colors duration-300 cursor-pointer ${
                      isCameraOn
                        ? "bg-green-500 hover:bg-green-600 active:bg-green-700"
                        : "bg-red-500 hover:bg-red-600 active:bg-red-700"
                    } text-white`}
                    onClick={toggleCamera}
                  >
                    {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
                  </button>
                  <button
                    className="p-2 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-colors duration-300 cursor-pointer"
                    onClick={onEndCall}
                  >
                    <FaPhoneSlash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Separate component for each peer video
const PeerVideo = ({
  peer,
  isMainView,
}: {
  peer: PeerData;
  isMainView: boolean;
}) => {
  const peerVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [username, setUsername] = React.useState("Unknown User");

  React.useEffect(() => {
    const fetchUsername = async () => {
      const name = await getUserName(peer.userId);
      setUsername(name);
    };

    fetchUsername();
  }, [peer.userId]);

  React.useEffect(() => {
    if (peerVideoRef.current && peer.stream) {
      peerVideoRef.current.srcObject = peer.stream;
    }
  }, [peer]);

  return (
    <div
      className={`relative ${
        isMainView ? "w-full h-full" : "min-h-0"
      } bg-gray-900 rounded-lg overflow-hidden`}
    >
      <video
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted={false}
        ref={peerVideoRef}
      />
      {peer.userId && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {username}
        </div>
      )}
    </div>
  );
};

export default VideoContainer;
