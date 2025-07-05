"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HeartbeatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useHeartbeat(); // triggers ping every 30s

  return <>{children}</>;
}

function useHeartbeat(interval = 30000) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    const ping = () => {
      fetch("/api/user/ping", { method: "POST" });
    };

    ping();
    const id = setInterval(ping, interval);
    return () => clearInterval(id);
  }, [interval, status]);
}
