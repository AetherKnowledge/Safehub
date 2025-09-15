"use client";
import { useWebSocket } from "@/lib/socket/hooks/useWebsocket";
import {
  SocketError,
  SocketEvent,
  SocketEventType,
} from "@/lib/socket/SocketEvents";
import { env } from "next-runtime-env";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface Prop {
  children: ReactNode;
}

interface SocketContextType {
  socket: WebSocket | null;
  onRecieveData: (handler: (data: SocketEvent) => void) => () => void;
  onRecieveError: (handler: (error: SocketError) => void) => () => void;
  send: (event: SocketEventType, payload: SocketEvent["payload"]) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const SocketProvider = ({ children }: Prop) => {
  const url = useMemo(() => {
    return () =>
      env("NEXT_PUBLIC_URL")?.startsWith("https")
        ? `wss://${window.location.host}/api/user/socket`
        : `ws://${window.location.host}/api/user/socket`;
  }, []);
  const { socket } = useWebSocket(url, {
    reconnect: true,
    reconnectIntervalMs: 5000,
  });

  const recieveDataHandlersRef = useRef<Set<(data: SocketEvent) => void>>(
    new Set()
  );

  const recieveErrorHandlersRef = useRef<Set<(error: SocketError) => void>>(
    new Set()
  );

  useEffect(() => {
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const socketEvent: SocketEvent = JSON.parse(event.data);
          if (socketEvent.type === SocketEventType.ERROR) {
            recieveErrorHandlersRef.current.forEach((handler) => {
              handler(socketEvent.payload as SocketError);
            });
            console.warn("Socket error received:", event.data as SocketError);
            return;
          }

          recieveDataHandlersRef.current.forEach((handler) => {
            handler(socketEvent);
          });
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socket.addEventListener("message", handleMessage);

      return () => {
        socket.removeEventListener("message", handleMessage);
      };
    }
  }, [socket]);

  const onRecieveData = (handler: (data: SocketEvent) => void) => {
    recieveDataHandlersRef.current.add(handler);

    // Return cleanup function
    return () => {
      recieveDataHandlersRef.current.delete(handler);
    };
  };

  const onRecieveError = (handler: (error: SocketError) => void) => {
    recieveErrorHandlersRef.current.add(handler);

    // Return cleanup function
    return () => {
      recieveErrorHandlersRef.current.delete(handler);
    };
  };

  const send = (event: SocketEventType, payload: SocketEvent["payload"]) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("Socket not open. Cannot send message.");
      return;
    }

    const socketEvent: SocketEvent = { type: event, payload };
    socket.send(JSON.stringify(socketEvent));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onRecieveData,
        onRecieveError,
        send,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
