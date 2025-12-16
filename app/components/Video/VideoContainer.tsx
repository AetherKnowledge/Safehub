"use client";

import { Appointment } from "@/app/generated/prisma/browser";
import { getAppointmentForCall } from "@/app/pages/Appointment/AppointmentActions";
import { PeerData } from "@/lib/socket/hooks/useCalling";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import PeerVideo from "./PeerVideo";
import VideoCallNotes from "./VideoCallNotes";
import VideoControls from "./VideoControls";
import VideoSettings from "./VideoSettings";

interface Props {
  localStream: MediaStream | null;
  onEndCall?: () => void;
  peers?: PeerData[];
  visible?: boolean;
  onStreamUpdate?: (stream: MediaStream) => void;
}

const VideoContainer = ({
  localStream,
  onEndCall,
  peers,
  onStreamUpdate,
}: Props) => {
  const hasCamera = localStream
    ? localStream.getVideoTracks().length > 0
    : false;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(hasCamera || false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn((prev) => !prev);
    }
  }, [localStream]);

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
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn((prev) => !prev);
    }
  }, [localStream]);

  const toggleNotes = useCallback(() => {
    setIsNotesOpen((prev) => !prev);
  }, []);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const isCounselor = session.data?.user.type === "Counselor";
  const showNotesButton = isCounselor && appointment !== null;

  React.useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

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
      className={`fixed inset-0 min-w-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-brightness-50 z-9999`}
    >
      <div className="max-h-100vh overflow-y-auto w-full items-center justify-center scrollbar-gutter-stable">
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
                        {localStream && (
                          <video
                            className="absolute top-3 right-3 w-24 h-16 sm:w-32 sm:h-24 md:w-48 md:h-36 rounded-lg border-2 border-gray-300 z-20 object-cover"
                            autoPlay
                            playsInline
                            muted={true}
                            ref={videoRef}
                          />
                        )}

                        {/* Peer videos */}
                        <PeerVideos peers={peers || []} />

                        {/* Control buttons at bottom center */}
                        <VideoControls
                          isMicOn={isMicOn}
                          toggleMic={toggleMic}
                          isCameraOn={isCameraOn}
                          toggleCamera={toggleCamera}
                          toggleSettings={toggleSettings}
                          toggleFullscreen={toggleFullscreen}
                          isFullscreen={isFullscreen}
                          showNotesButton={showNotesButton}
                          isNotesOpen={isNotesOpen}
                          toggleNotes={toggleNotes}
                          onEndCall={() => onEndCall?.()}
                          hasCamera={hasCamera || false}
                        />
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
                      {localStream && (
                        <video
                          className="absolute top-2 right-2 w-24 h-16 sm:w-32 sm:h-24 md:w-48 md:h-36 rounded-lg border-2 border-gray-300 z-10 object-cover"
                          autoPlay
                          playsInline
                          muted={true}
                          ref={videoRef}
                        />
                      )}

                      {/* Peer videos */}
                      <PeerVideos peers={peers || []} />

                      {/* Control buttons */}
                      <VideoControls
                        isMicOn={isMicOn}
                        toggleMic={toggleMic}
                        isCameraOn={isCameraOn}
                        toggleCamera={toggleCamera}
                        toggleSettings={toggleSettings}
                        toggleFullscreen={toggleFullscreen}
                        isFullscreen={isFullscreen}
                        showNotesButton={showNotesButton}
                        isNotesOpen={isNotesOpen}
                        toggleNotes={toggleNotes}
                        onEndCall={() => onEndCall?.()}
                        hasCamera={hasCamera || false}
                      />
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
      {isSettingsOpen && (
        <VideoSettings
          onClose={toggleSettings}
          stream={localStream}
          onDeviceChange={async (deviceId, kind) => {
            if (!localStream) return;

            try {
              if (kind === "audioinput") {
                // Get new audio track
                const newStream = await navigator.mediaDevices.getUserMedia({
                  audio: { deviceId: { exact: deviceId } },
                  video: false,
                });

                const newAudioTrack = newStream.getAudioTracks()[0];
                const oldAudioTrack = localStream.getAudioTracks()[0];

                // Replace track in all peer connections
                if (peers) {
                  for (const peer of peers) {
                    const senders =
                      // @ts-expect-error -- access underlying RTCPeerConnection
                      peer.peerConnection._pc.getSenders() as RTCRtpSender[];
                    const audioSender = senders.find(
                      (s) => s.track?.kind === "audio"
                    );
                    if (audioSender && newAudioTrack) {
                      await audioSender.replaceTrack(newAudioTrack);
                    }
                  }
                }

                // Replace in local stream
                if (oldAudioTrack) {
                  localStream.removeTrack(oldAudioTrack);
                  oldAudioTrack.stop();
                }
                localStream.addTrack(newAudioTrack);

                // Update video element
                if (videoRef.current) {
                  videoRef.current.srcObject = localStream;
                }

                // Notify parent component
                if (onStreamUpdate) {
                  onStreamUpdate(localStream);
                }
              } else if (kind === "videoinput") {
                // Get new video track
                const newStream = await navigator.mediaDevices.getUserMedia({
                  video: {
                    deviceId: { exact: deviceId },
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 },
                  },
                  audio: false,
                });

                const newVideoTrack = newStream.getVideoTracks()[0];
                const oldVideoTrack = localStream.getVideoTracks()[0];

                // Replace track in all peer connections
                if (peers) {
                  for (const peer of peers) {
                    const senders =
                      // @ts-expect-error -- access underlying RTCPeerConnection
                      peer.peerConnection._pc.getSenders() as RTCRtpSender[];
                    const videoSender = senders.find(
                      (s) => s.track?.kind === "video"
                    );
                    if (videoSender && newVideoTrack) {
                      await videoSender.replaceTrack(newVideoTrack);
                    }
                  }
                }

                // Replace in local stream
                if (oldVideoTrack) {
                  localStream.removeTrack(oldVideoTrack);
                  oldVideoTrack.stop();
                }
                localStream.addTrack(newVideoTrack);

                // Update video element
                if (videoRef.current) {
                  videoRef.current.srcObject = localStream;
                }

                // Notify parent component
                if (onStreamUpdate) {
                  onStreamUpdate(localStream);
                }
              }
            } catch (error) {
              console.error("Error changing device:", error);
            }
          }}
        />
      )}
    </div>,
    document.body
  );
};

const PeerVideos = ({ peers }: { peers: PeerData[] }) => {
  return (
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
  );
};

export default VideoContainer;
