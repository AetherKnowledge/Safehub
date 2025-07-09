"use client";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useWebSocket } from "./Chats/Chatbox/useWebsocket";

interface Prop {
  children: ReactNode;
}

interface SocketContextType {
  socket: WebSocket | null;
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
    return () => `ws://${window.location.host}/api/user/socket`;
  }, []);
  const { socket } = useWebSocket(url, {
    reconnect: true,
    reconnectIntervalMs: 1000,
  });

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
