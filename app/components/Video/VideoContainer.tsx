"use client";

import { Appointment } from "@/app/generated/prisma/browser";
import { getAppointmentForCall } from "@/app/pages/Appointment/AppointmentActions";
import { getUserName } from "@/lib/socket/hooks/CallActions";
import { PeerData } from "@/lib/socket/hooks/useCalling";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  FaCompress,
  FaExpand,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import VideoCallNotes from "./VideoCallNotes";

interface Props {
  stream: MediaStream | null;
  isLocalStream: boolean;
  onEndCall?: () => void;
  peers?: PeerData[];
  visible?: boolean;
}

const VideoContainer = ({ stream, isLocalStream, onEndCall, peers }: Props) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const session = useSession();

  useEffect(() => {
    async function fetchAppointment() {
      if (!session.data?.user.id || session.data?.user.deactivated) return;

      const studentId = peers?.find(
        (peer) => peer.userId !== session.data?.user.id
      )?.userId;
      if (!studentId) return;

      const result = await getAppointmentForCall(studentId);
      if (!result.success || !result.data) return;

      setAppointment(result.data);
    }

    fetchAppointment();
  }, [session.data?.user.id, peers]);

  const toggleMic = useCallback(() => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn((prev) => !prev);
    }
  }, [stream]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn((prev) => !prev);
    }
  }, [stream]);

  const toggleNotes = useCallback(() => {
    setIsNotesOpen((prev) => !prev);
  }, []);

  const isCounselor = session.data?.user.type === "Counselor";
  const showNotesButton = isCounselor && appointment !== null;

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 min-w-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-[9999]`}
    >
      <div className="max-h-[100vh] overflow-y-auto w-full items-center justify-center scrollbar-gutter-stable">
        <div className="flex-1 flex p-5 items-center justify-center">
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <div
              ref={containerRef}
              className="w-full h-full max-w-[95vw] sm:max-w-[90vw] md:max-w-none mx-auto"
            >
              {isFullscreen ? (
                // Fullscreen: video area with optional notes sidebar
                <div className="w-screen h-screen bg-black flex">
                  <div
                    className={`flex flex-col transition-all duration-300 ${
                      isNotesOpen ? "w-[calc(100%-320px)]" : "w-full"
                    }`}
                  >
                    {/* Header with title and participant count */}
                    <div className="flex items-center justify-between px-6 py-4 text-white">
                      <div className="text-left">
                        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary mb-1">
                          SafeHub · LCUP
                        </p>
                        <h3 className="text-lg sm:text-xl font-semibold leading-snug">
                          Video call
                        </h3>
                      </div>
                      {peers && (
                        <span className="badge badge-outline text-xs text-base-content/70">
                          {1 + peers.length} participant
                          {peers.length ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {/* Video area */}
                    <div className="flex-1 flex items-center justify-center px-2 sm:px-4 md:px-8 pb-20">
                      <div className="relative w-full aspect-video max-h-[90vh]">
                        {/* Local stream video (small, top-right) */}
                        {stream && (
                          <video
                            className="absolute top-3 right-3 w-24 h-16 sm:w-32 sm:h-24 md:w-48 md:h-36 rounded-lg border-2 border-gray-300 z-20 object-cover"
                            autoPlay
                            playsInline
                            muted={isLocalStream}
                            ref={videoRef}
                          />
                        )}

                        {/* Peer videos */}
                        <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
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
                            <div className="flex items-center justify-center w-full h-full bg-gray-900">
                              <p className="text-base-content/70 text-sm">
                                Waiting for other participants...
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Control buttons at bottom center */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
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
                            className="p-2 rounded-full bg-base-100/80 border border-base-300 hover:bg-base-200 text-base-content transition-colors duration-300 cursor-pointer"
                            type="button"
                            onClick={toggleFullscreen}
                          >
                            <FaCompress />
                          </button>
                          {showNotesButton && (
                            <button
                              className={`p-2 rounded-full transition-colors duration-300 cursor-pointer ${
                                isNotesOpen
                                  ? "bg-primary text-white hover:bg-primary/80 active:bg-primary/90"
                                  : "bg-base-100/80 border border-base-300 hover:bg-base-200 text-base-content"
                              }`}
                              type="button"
                              onClick={toggleNotes}
                            >
                              <LuClipboardList />
                            </button>
                          )}
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
                  {/* Notes sidebar in fullscreen */}
                  {showNotesButton && appointment && (
                    <div
                      className={`transition-all duration-300 h-full ${
                        isNotesOpen ? "w-[320px]" : "w-0"
                      } overflow-hidden`}
                    >
                      <VideoCallNotes
                        appointment={appointment}
                        isOpen={isNotesOpen}
                        onClose={toggleNotes}
                      />
                    </div>
                  )}
                </div>
              ) : (
                // Normal card layout with controls and optional sidebar
                <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full flex flex-col md:flex-row overflow-hidden">
                  <div
                    className={`transition-all duration-300 ${
                      isNotesOpen ? "md:w-[calc(100%-320px)]" : "w-full"
                    } p-4 sm:p-6 text-center`}
                  >
                    <div className="flex items-center justify-between mb-3 text-base-content">
                      <div className="text-left">
                        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary mb-1">
                          SafeHub · LCUP
                        </p>
                        <h3 className="text-lg sm:text-xl font-semibold leading-snug">
                          Video call
                        </h3>
                      </div>
                      {peers && (
                        <span className="badge badge-outline text-xs text-base-content/70">
                          {1 + peers.length} participant
                          {peers.length ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="relative w-full mx-auto aspect-video rounded-2xl border border-base-300 bg-base-200/80 overflow-hidden">
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
                          className="p-2 rounded-full bg-base-100/80 border border-base-300 hover:bg-base-200 text-base-content transition-colors duration-300 cursor-pointer"
                          type="button"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? <FaCompress /> : <FaExpand />}
                        </button>
                        {showNotesButton && (
                          <button
                            className={`p-2 rounded-full transition-colors duration-300 cursor-pointer ${
                              isNotesOpen
                                ? "bg-primary text-white hover:bg-primary/80 active:bg-primary/90"
                                : "bg-base-100/80 border border-base-300 hover:bg-base-200 text-base-content"
                            }`}
                            type="button"
                            onClick={toggleNotes}
                          >
                            <LuClipboardList />
                          </button>
                        )}
                        <button
                          className="p-2 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white transition-colors duration-300 cursor-pointer"
                          onClick={onEndCall}
                        >
                          <FaPhoneSlash />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Notes sidebar in normal view */}
                  {showNotesButton && appointment && (
                    <div
                      className={`transition-all duration-300 ${
                        isNotesOpen
                          ? "w-full md:w-[320px] h-[300px] md:h-auto"
                          : "w-0 h-0"
                      } overflow-hidden`}
                    >
                      <VideoCallNotes
                        appointment={appointment}
                        isOpen={isNotesOpen}
                        onClose={toggleNotes}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
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
