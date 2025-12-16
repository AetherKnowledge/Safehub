"use client";

import { useEffect, useState } from "react";
import { Option } from "../Input/InputInterface";
import SelectBox from "../Input/SelectBox";
import ModalBase from "../Popup/ModalBase";

interface Props {
  onClose?: () => void;
  stream: MediaStream | null;
  onDeviceChange?: (deviceId: string, kind: MediaDeviceKind) => void;
}

const VideoSettings = ({ onClose, stream, onDeviceChange }: Props) => {
  const [audioDevices, setAudioDevices] = useState<Option[]>([]);
  const [videoDevices, setVideoDevices] = useState<Option[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioInputs = devices
          .filter((device) => device.kind === "audioinput")
          .map((device) => ({
            label: device.label || `Microphone ${device.deviceId.slice(0, 5)}`,
            value: device.deviceId,
          }));

        const videoInputs = devices
          .filter((device) => device.kind === "videoinput")
          .map((device) => ({
            label: device.label || `Camera ${device.deviceId.slice(0, 5)}`,
            value: device.deviceId,
          }));

        setAudioDevices(audioInputs);
        setVideoDevices(videoInputs);

        // Set current devices from stream
        if (stream) {
          const audioTrack = stream.getAudioTracks()[0];
          const videoTrack = stream.getVideoTracks()[0];

          if (audioTrack) {
            const settings = audioTrack.getSettings();
            setSelectedAudio(settings.deviceId || "");
          }

          if (videoTrack) {
            const settings = videoTrack.getSettings();
            setSelectedVideo(settings.deviceId || "");
          }
        }
      } catch (error) {
        console.error("Error enumerating devices:", error);
      }
    }

    getDevices();
  }, [stream]);

  return (
    <ModalBase onClose={onClose}>
      <div className="bg-base-100 p-6 rounded-2xl shadow-2xl text-base-content max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-primary mb-1">
              Video Call
            </p>
            <h3 className="text-xl font-semibold">Settings</h3>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Microphone Selector */}
          <div className="bg-base-200 rounded-xl p-4 border border-base-300">
            <p className="text-xs text-base-content/60 mb-3 font-medium uppercase tracking-wide">
              Microphone
            </p>
            <SelectBox
              name="microphone"
              options={audioDevices}
              value={selectedAudio}
              placeholder="Select microphone"
              onChange={(option) => {
                setSelectedAudio(option.value);
                if (onDeviceChange) {
                  onDeviceChange(option.value, "audioinput");
                }
              }}
              noFormOutput
            />
          </div>

          {/* Camera Selector */}
          <div className="bg-base-200 rounded-xl p-4 border border-base-300">
            <p className="text-xs text-base-content/60 mb-3 font-medium uppercase tracking-wide">
              Camera
            </p>
            <SelectBox
              name="camera"
              options={videoDevices}
              value={selectedVideo}
              placeholder="Select camera"
              onChange={(option) => {
                setSelectedVideo(option.value);
                if (onDeviceChange) {
                  onDeviceChange(option.value, "videoinput");
                }
              }}
              noFormOutput
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn btn-primary">
            Done
          </button>
        </div>
      </div>
    </ModalBase>
  );
};

export default VideoSettings;
