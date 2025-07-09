"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebSocketOptions {
  reconnect?: boolean;
  reconnectIntervalMs?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  socket: WebSocket | null;
  connect: () => void;
  disconnect: () => void;
  isConnected: boolean;
  error: string | null;
}

export function useWebSocket(
  urlFn: () => string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const {
    reconnect = true,
    reconnectIntervalMs = 1000,
    maxReconnectAttempts = 5,
  } = options;

  const session = useSession();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pathname = usePathname();
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current) return;

    const socket = new WebSocket(urlFn());

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
      console.log("[WebSocket] Connected");
    };

    socket.onclose = (event) => {
      console.log("[WebSocket] Closed", event);
      setIsConnected(false);
      socketRef.current = null;

      if (event.code !== 1000) {
        setError("WebSocket connection closed unexpectedly.");
        return;
      }

      if (reconnect && reconnectAttempts.current < maxReconnectAttempts) {
        const delay = reconnectIntervalMs * 2 ** reconnectAttempts.current;
        reconnectAttempts.current += 1;

        console.log(
          `[WebSocket] Attempting reconnect #${reconnectAttempts.current} in ${delay}ms`
        );

        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, delay);
      }
    };

    socket.onerror = (event) => {
      console.error("[WebSocket] Error:", event);
      setError("WebSocket encountered an error.");
    };

    socketRef.current = socket;
  }, [urlFn, reconnect, reconnectIntervalMs, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    reconnectTimeout.current && clearTimeout(reconnectTimeout.current);
    reconnectTimeout.current = null;

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setIsConnected(false);
    console.log("[WebSocket] Manually disconnected");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      connect();
    }, 50); // Allow time for the component to mount before connecting

    return () => {
      disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    isConnected,
    error,
  };
}
