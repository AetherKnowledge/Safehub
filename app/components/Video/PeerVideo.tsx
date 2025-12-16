"use client";

import { getUserName } from "@/lib/socket/hooks/CallActions";
import { PeerData } from "@/lib/socket/hooks/useCalling";
import React, { useEffect, useState } from "react";

const PeerVideo = ({
  peer,
  isMainView,
}: {
  peer: PeerData;
  isMainView: boolean;
}) => {
  const peerVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [username, setUsername] = React.useState("Unknown User");
  const [isConnected, setIsConnected] = React.useState(false);
  const [hasCamera, setHasCamera] = useState(false);

  const isLoading = !isConnected && !peer.stream;

  useEffect(() => {
    const fetchUsername = async () => {
      const name = await getUserName(peer.userId);
      setUsername(name);
    };

    fetchUsername();
  }, [peer.userId]);

  useEffect(() => {
    if (peerVideoRef.current && peer.stream) {
      console.log(peer.stream);
      setHasCamera(true);

      peerVideoRef.current.srcObject = peer.stream;
    }
  }, [peer]);

  useEffect(() => {
    const peerConnection = peer.peerConnection;

    const handleConnect = () => {
      console.log("Peer connected");
      setIsConnected(true);
    };

    const handleClose = () => {
      console.log("Peer closed");
      setIsConnected(false);
    };

    // Check initial connection state
    if (peerConnection.connected) {
      setIsConnected(true);
    }

    // Listen to connection events
    peerConnection.on("connect", handleConnect);
    peerConnection.on("close", handleClose);

    return () => {
      peerConnection.off("connect", handleConnect);
      peerConnection.off("close", handleClose);
    };
  }, [peer.peerConnection]);

  return (
    <div
      className={`relative ${
        isMainView ? "w-full h-full" : "min-h-0"
      } bg-gray-900 rounded-lg overflow-hidden`}
    >
      <video
        className={`w-full h-full object-cover ${!hasCamera ? "hidden" : ""}`}
        autoPlay
        playsInline
        muted={false}
        ref={peerVideoRef}
      />
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-2"></div>
            <p className="text-white text-sm">Connecting...</p>
          </div>
        </div>
      ) : !hasCamera ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <p className="text-white text-center">
            No camera available
            <br />
            <span className="text-sm text-gray-400">Audio only</span>
          </p>
        </div>
      ) : null}
      {peer.userId && (
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {username}
        </div>
      )}
    </div>
  );
};

export default PeerVideo;
