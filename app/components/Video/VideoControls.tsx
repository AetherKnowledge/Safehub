import {
  FaCompress,
  FaExpand,
  FaMicrophone,
  FaMicrophoneSlash,
  FaPhoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa6";
import { LuClipboardList } from "react-icons/lu";
import { MdSettings } from "react-icons/md";

const VideoControls = ({
  isMicOn,
  toggleMic,
  isCameraOn,
  toggleCamera,
  toggleSettings,
  toggleFullscreen,
  isFullscreen,
  showNotesButton,
  isNotesOpen,
  toggleNotes,
  onEndCall,
  hasCamera,
}: {
  isMicOn: boolean;
  toggleMic: () => void;
  isCameraOn: boolean;
  toggleCamera: () => void;
  toggleSettings: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
  showNotesButton: boolean;
  isNotesOpen: boolean;
  toggleNotes: () => void;
  onEndCall: () => void;
  hasCamera: boolean;
}) => {
  return (
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
        className={`p-2 rounded-full transition-colors duration-300 ${
          !hasCamera
            ? "bg-gray-500 cursor-not-allowed opacity-50"
            : isCameraOn
            ? "bg-green-500 hover:bg-green-600 active:bg-green-700 cursor-pointer"
            : "bg-red-500 hover:bg-red-600 active:bg-red-700 cursor-pointer"
        } text-white`}
        onClick={toggleCamera}
        disabled={!hasCamera}
      >
        {isCameraOn ? <FaVideo /> : <FaVideoSlash />}
      </button>
      <button
        className="p-2 rounded-full bg-base-100/80 border border-base-300 hover:bg-base-200 text-base-content transition-colors duration-300 cursor-pointer"
        type="button"
        onClick={toggleSettings}
      >
        <MdSettings />
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
  );
};

export default VideoControls;
