"use client";
import OrdersByDayChart from "@/app/components/Charts/OrdersByDayChart";
import { useEffect } from "react";
import { useSocket } from "../../SocketProvider";

const Dashboard = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.send(JSON.stringify({ message: "Dashboard connected" }));
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received from server:", data);
    };

    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <div>
      <div className="flex flex-col h-[82vh] ">
        <div className="p-4 border-b-1 border-none rounded-t-2xl text-base-content bg-base-100">
          <h2 className="text-3xl font-bold text-primary">Dashboard</h2>
        </div>
        <div className="divider mt-[-8] pl-3 pr-3" />
        <OrdersByDayChart />
      </div>
    </div>
  );
};

export default Dashboard;
