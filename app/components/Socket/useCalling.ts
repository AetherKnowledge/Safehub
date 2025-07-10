import { CallStatus } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  CallAnswerType,
  SocketAnswerCall,
  SocketCallEnded,
  SocketEventType,
  SocketInitiateCall,
  SocketLeaveCall,
} from "./SocketEvents";
import { useSocket } from "./SocketProvider";

export function useCalling(chatId: string) {
  const session = useSession();
  const socket = useSocket().socket;
  const [calling, setCalling] = useState<SocketInitiateCall | null>(null);
  const onRecieveCall = useSocket().onRecieveCall;
  const onRecieveCallEnded = useSocket().onRecieveCallEnded;
  const onAnswerCall = useSocket().onAnswerCall;
  const onRecieveCallLeft = useSocket().onRecieveCallLeft;

  useEffect(() => {
    const recieveCall = onRecieveCall((data: SocketInitiateCall) => {
      console.log("Received call data:", data);
      if (data.chatId === chatId) {
        // Handle the call data, e.g., show a notification or update state
        console.log(`Incoming call from ${data.callerName} in chat ${chatId}`);
      }
      // Set the calling state to the received call data
      setCalling(data);
    });

    return () => {
      recieveCall();
    };
  }, [onRecieveCall]);

  useEffect(() => {
    const answerCall = onAnswerCall((data: SocketAnswerCall) => {
      console.log("Call answered:", data);
      if (data.chatId === chatId) {
        // Handle the call answered event, e.g., show a notification or update state
        console.log(`Call answered in chat ${chatId} by ${data.userName}`);
      }
    });

    return () => {
      answerCall();
    };
  }, [onAnswerCall]);

  useEffect(() => {
    const recieveCallLeft = onRecieveCallLeft((data: SocketLeaveCall) => {
      console.log("Call left:", data);
      if (data.chatId === chatId) {
        // Handle the call left event, e.g., show a notification or update state
        console.log(`Call left in chat ${chatId} by ${data.userName}`);
      }
    });

    return () => {
      recieveCallLeft();
    };
  }, [onRecieveCallLeft]);

  useEffect(() => {
    const recieveCallEnded = onRecieveCallEnded((data: SocketCallEnded) => {
      console.log("Call ended:", data);
      if (data.chatId === chatId) {
        // Handle the call ended event, e.g., show a notification or update state
        console.log(`Call ended in chat ${chatId}`);
      }

      setCalling(null); // Clear the calling state
    });

    return () => {
      recieveCallEnded();
    };
  }, [onRecieveCallEnded]);

  const initiateCall = (receiverId: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot initiate call.");
      return;
    }

    if (!session.data?.user.id) {
      console.warn("User not authenticated. Cannot initiate call.");
      return;
    }

    const callData: SocketInitiateCall = {
      status: CallStatus.Pending,
      callId: crypto.randomUUID(),
      callerId: session.data?.user.id, // Replace with actual user ID
      receiverId,
      chatId,
    };

    const message = {
      type: "initiateCall",
      payload: callData,
    };

    socket.send(JSON.stringify(message));
    setCalling(callData);
  };

  const answerCall = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot answer call.");
      return;
    }

    if (!calling) {
      console.warn("No call to answer.");
      return;
    }

    const answerData = {
      callId: calling?.callId,
      chatId,
      answer: CallAnswerType.ACCEPT,
    } as SocketAnswerCall;

    const message = {
      type: SocketEventType.ANSWERCALL,
      payload: answerData,
    };

    socket.send(JSON.stringify(message));
  };

  const rejectCall = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot reject call.");
      return;
    }

    if (!calling) {
      console.warn("No call to reject.");
      return;
    }

    const answerData = {
      callId: calling?.callId,
      chatId,
      answer: CallAnswerType.REJECT,
    } as SocketAnswerCall;

    const message = {
      type: SocketEventType.ANSWERCALL,
      payload: answerData,
    };

    socket.send(JSON.stringify(message));
  };

  const leaveCall = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot leave call.");
      return;
    }

    if (!calling) {
      console.warn("No call to leave.");
      return;
    }

    const leaveData = {
      callId: calling?.callId,
      chatId,
    };

    const message = {
      type: SocketEventType.LEAVECALL,
      payload: leaveData,
    };
    // Send the leave call message to the server
    socket.send(JSON.stringify(message));
    setCalling(null); // Clear the calling state
  };

  return [calling, initiateCall, answerCall, rejectCall, leaveCall] as const;
}
