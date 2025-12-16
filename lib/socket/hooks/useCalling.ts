import { CallStatus } from "@/app/generated/prisma/browser";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import {
  Recipient,
  SocketAnswerCall,
  SocketCallEnded,
  SocketErrorCallType,
  SocketEvent,
  SocketEventType,
  SocketInitiateCall,
  SocketLeaveCall,
  SocketSdp,
} from "../SocketEvents";
import { useSocket } from "../SocketProvider";
import { getIceServers } from "./turnServerActions";

export type PeerData = {
  peerConnection: Peer.Instance;
  stream?: MediaStream;
  userId: string;
};

// TODO: Fix bug reject call not closing call for caller

// TODO: Add turn server with metered.ca

export function useCalling() {
  const session = useSession();
  const socket = useSocket().socket;
  const onRecieveData = useSocket().onRecieveData;
  const onRecieveError = useSocket().onRecieveError;
  const [currentCall, setCurrentCall] = useState<SocketInitiateCall | null>(
    null
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callMembers, setCallMembers] = useState<string[]>([]);
  const [peers, setPeers] = useState<PeerData[]>([]);

  const createPeer = useCallback(
    async (member: string, stream: MediaStream, initiator: boolean) => {
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not open. Cannot create peer for member.");
        return;
      }

      if (!currentCall) {
        console.warn("No active call to create peer for member:", member);
        return;
      }

      if (!session.data?.user.id || session.data?.user.deactivated) {
        console.warn("User not authenticated. Cannot create peer for member.");
        return;
      }

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not open. Cannot create peer.");
        return null;
      }

      const iceServers: RTCIceServer[] = (await getIceServers(
        currentCall.callId
      )) || [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ];

      console.log("Creating peer for member:", member);
      const peer = new Peer({
        stream,
        initiator,
        trickle: false,
        config: { iceServers },
      });

      peer.on("signal", (signalData) => {
        console.log("Sending SDP signal to member:", member);
        const sdpData = {
          type: SocketEventType.SDP,
          payload: {
            from: session.data?.user.id,
            to: member,
            callId: currentCall.callId,
            chatId: currentCall.chatId,
            sdpData: JSON.stringify(signalData),
          } as SocketSdp,
        } as SocketEvent;
        socket.send(JSON.stringify(sdpData));
      });

      peer.on("connect", () => {
        console.log("yo");
        peer.send("Hello from " + session.data?.user.id);
      });

      peer.on("stream", (remoteStream) => {
        console.log("Peer connected:", peer.connected);
        console.log("Received remote stream:", remoteStream);
        console.log(
          "Remote stream video tracks:",
          remoteStream.getVideoTracks().length
        );
        console.log(
          "Remote stream audio tracks:",
          remoteStream.getAudioTracks().length
        );

        // Log resolution immediately when stream is received
        remoteStream.getVideoTracks().forEach((track) => {
          const settings = track.getSettings();
          console.log(
            `Remote stream resolution: ${settings.width}x${settings.height}`
          );
        });

        // Update the peers state with the new remote stream
        setPeers((prev) =>
          prev.map((p) =>
            p.userId === member ? { ...p, stream: remoteStream } : p
          )
        );
      });

      peer.on("error", (error) => {
        console.error("Peer connection error:", error);
      });

      peer.on("close", () => {
        console.log("Peer connection closed.");
        setPeers((prev) => prev.filter((p) => p.userId !== member));

        // TODO: Remove peers one by one if no peer left leave the call
        if (peers.length === 0) {
          leaveCall();
        }
      });

      peer.on("data", (data) => {
        console.log(data);
      });

      setPeers((prev) => [
        ...prev,
        { peerConnection: peer, userId: member, stream: undefined },
      ]);

      return peer;
    },
    [currentCall, setPeers, peers]
  );

  const getMediaStream = useCallback(async () => {
    if (localStream) {
      return localStream;
    }

    try {
      // 1️⃣ Try camera + mic first
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          facingMode: "user",
        },
      });

      setLocalStream(stream);
      return stream;
    } catch (videoError) {
      console.warn(
        "Camera not available, falling back to mic only.",
        videoError
      );

      try {
        // 2️⃣ Fallback to mic only
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        setLocalStream(audioStream);
        return audioStream;
      } catch (audioError) {
        console.error("Error accessing microphone.", audioError);
        setLocalStream(null);
        return null;
      }
    }
  }, [localStream]);

  useEffect(() => {
    console.log("Current peers:", peers);
  }, [peers]);

  // Cleanup function to stop the local stream tracks when the component unmounts
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [localStream]);

  useEffect(() => {
    // Ref to store debounce timers per user
    const sdpTimers = new Map<string, NodeJS.Timeout>();

    function recievedCallHandler(data: SocketInitiateCall) {
      console.log("Received call data:", data);
      console.log(
        `Incoming call from ${data.callerName} in chat ${data.chatId}`
      );

      // Set the calling state to the received call data
      setCurrentCall(data);
    }

    function answeredCallHandler(data: SocketAnswerCall) {
      console.log("Call answered:", data);
      if (data.chatId === currentCall?.chatId) {
        // Handle the call answered event, e.g., show a notification or update state
        console.log(
          `Call answered in chat ${currentCall?.chatId} by ${data.userName}`
        );
      }

      if (!currentCall) {
        console.warn("No call to answer.");
        return;
      }

      // TODO: Check if using setCalling works properly
      // calling.status = CallStatus.Accepted;
      // Update the call status to accepted

      setCurrentCall((prev) =>
        prev ? { ...prev, status: data.answer } : prev
      );
      setCallMembers((prev) => {
        const updatedMembers = [...prev];
        if (!updatedMembers.includes(data.userId)) {
          updatedMembers.push(data.userId);
        }
        return updatedMembers;
      });
    }

    function recieveCallLeftHandler(data: SocketLeaveCall) {
      console.log("Call left:", data);
      if (data.chatId === currentCall?.chatId) {
        // Handle the call left event, e.g., show a notification or update state
        console.log(
          `Call left in chat ${currentCall?.chatId} by ${data.userName}`
        );
      }
    }

    function recieveCallEnded(data: SocketCallEnded) {
      if (!currentCall) {
        console.warn("No active call to handle call ended event.");
        return;
      }

      console.log("Call ended:", data);
      if (data.chatId === currentCall?.chatId) {
        // Handle the call ended event, e.g., show a notification or update state
        console.log(`Call ended in chat ${currentCall?.chatId}`);
      }

      setCurrentCall(null); // Clear the calling state
      setLocalStream(null); // Clear the local stream
    }

    function sdpHandler(data: SocketSdp) {
      console.log("Received SDP data:", data);

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not open. Cannot handle SDP offer.");
        return;
      }

      // If peer already exists, handle as usual
      if (peers.some((peer) => peer.userId === data.from)) {
        const peer = peers.find((peer) => peer.userId === data.from);
        if (!peer) return;
        try {
          const sdp = JSON.parse(data.sdpData) as SignalData;
          peer.peerConnection.signal(sdp);
        } catch (error) {
          console.error("Failed to parse SDP data:", error);
        }
        return;
      }

      // Debounce peer creation for this user
      // Without the debounce timer, multiple SDP offers could be sent in quick succession
      if (sdpTimers.has(data.from)) {
        clearTimeout(sdpTimers.get(data.from)!);
      }

      // Debounce peer creation for this user
      if (sdpTimers.has(data.from)) {
        clearTimeout(sdpTimers.get(data.from)!);
      }

      sdpTimers.set(
        data.from,
        setTimeout(async () => {
          let stream = localStream;
          if (!stream) {
            stream = await getMediaStream();
            if (!stream) {
              console.warn(
                "Failed to get media stream. Cannot handle SDP offer."
              );
              return;
            }
          }

          if (!currentCall) {
            console.warn("No call to handle SDP offer.");
            return;
          }

          const peer = await createPeer(data.from, stream, false);
          if (!peer) {
            console.warn(`Failed to create peer for member ${data.from}`);
            return;
          }

          try {
            const sdp = JSON.parse(data.sdpData) as SignalData;
            peer.signal(sdp);
          } catch (error) {
            console.error("Failed to parse SDP data:", error);
          }
          sdpTimers.delete(data.from);
        }, 1) // 1ms debounce delay
      );
    }

    const unsubscribe = onRecieveData((event) => {
      switch (event.type) {
        case SocketEventType.INITIATECALL:
          recievedCallHandler(event.payload as SocketInitiateCall);
          break;
        case SocketEventType.ANSWERCALL:
          answeredCallHandler(event.payload as SocketAnswerCall);
          break;
        case SocketEventType.LEAVECALL:
          recieveCallLeftHandler(event.payload as SocketLeaveCall);
          break;
        case SocketEventType.CALLENDED:
          recieveCallEnded(event.payload as SocketCallEnded);
          break;
        case SocketEventType.SDP:
          sdpHandler(event.payload as SocketSdp);
          break;
      }
    });

    return () => {
      unsubscribe();
      sdpTimers.forEach((timer) => clearTimeout(timer));
      sdpTimers.clear();
    };
  }, [onRecieveData, socket, peers, createPeer]);

  useEffect(() => {
    const unsubscribe = onRecieveError((error) => {
      if (error.errorType === SocketErrorCallType.NO_ANSWER) {
        setCurrentCall((prev) =>
          prev ? { ...prev, status: CallStatus.No_Answer } : prev
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [onRecieveError]);

  const initiateCall = useCallback(
    async (chatId: string, recipients: Recipient[], chatName?: string) => {
      const stream = await getMediaStream();
      if (!stream) {
        console.warn("No media stream available.");
      }

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.warn("Socket not open. Cannot initiate call.");
        return;
      }

      if (!session.data?.user.id || session.data?.user.deactivated) {
        console.warn("User not authenticated. Cannot initiate call.");
        return;
      }

      const callData: SocketInitiateCall = {
        status: CallStatus.Pending,
        callId: crypto.randomUUID(),
        callerId: session.data?.user.id,
        recipients,
        chatId,
        chatName,
      };

      const message = {
        type: SocketEventType.INITIATECALL,
        payload: callData,
      };

      socket.send(JSON.stringify(message));
      setCurrentCall(callData);
      setCallMembers([session.data?.user.id]);
    },
    [socket, session, currentCall]
  );

  const answerCall = useCallback(async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot answer call.");
      return;
    }

    if (!currentCall) {
      console.warn("No call to answer.");
      return;
    }

    let stream = localStream;
    if (!stream) {
      console.log("No local stream available. Getting media stream...");
      stream = await getMediaStream();
      if (!stream) {
        console.warn("Failed to get media stream. Cannot handle SDP offer.");
        return;
      }
    }

    if (!session.data?.user.id || session.data?.user.deactivated) {
      console.warn("User not authenticated. Cannot answer call.");
      return;
    }

    const answerData = {
      callId: currentCall?.callId,
      chatId: currentCall?.chatId,
      answer: CallStatus.Accepted,
    } as SocketAnswerCall;

    const message = {
      type: SocketEventType.ANSWERCALL,
      payload: answerData,
    };

    const updatedMembers = [...callMembers];
    if (!updatedMembers.includes(currentCall.callerId)) {
      updatedMembers.push(currentCall.callerId);
    }
    if (!updatedMembers.includes(session.data?.user.id)) {
      updatedMembers.push(session.data?.user.id);
    }
    setCallMembers(updatedMembers);

    console.log("Current call members:", updatedMembers);
    for (const member of updatedMembers) {
      if (member === session.data?.user.id) {
        continue; // Skip the local user
      }

      createPeer(member, stream, true);
    }

    socket.send(JSON.stringify(message));
  }, [socket, currentCall, peers, callMembers]);

  const rejectCall = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot reject call.");
      return;
    }

    if (!currentCall) {
      console.warn("No call to reject.");
      return;
    }

    const answerData = {
      callId: currentCall?.callId,
      chatId: currentCall?.chatId,
      answer: CallStatus.Rejected,
    } as SocketAnswerCall;

    const message = {
      type: SocketEventType.ANSWERCALL,
      payload: answerData,
    };

    socket.send(JSON.stringify(message));
  }, [socket, currentCall]);

  const leaveCall = useCallback(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot leave call.");
      return;
    }

    if (!currentCall) {
      console.warn("No call to leave.");
      return;
    }

    const leaveData = {
      callId: currentCall?.callId,
      chatId: currentCall?.chatId,
    };

    const message = {
      type: SocketEventType.LEAVECALL,
      payload: leaveData,
    };

    // Destroy all peers
    peers.forEach((p) => p.peerConnection.destroy());
    setPeers([]);

    // Existing cleanup logic
    setCurrentCall(null);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    // Send the leave call message to the server
    socket.send(JSON.stringify(message));
    setCurrentCall(null); // Clear the calling state
    setLocalStream(null); // Clear the local stream
  }, [socket, currentCall, localStream, peers]);

  return {
    currentCall,
    initiateCall,
    answerCall,
    rejectCall,
    leaveCall,
    localStream,
    peers,
  } as const;
}
