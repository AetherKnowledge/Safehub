"use client";
import React from "react";
import SidebarButton from "./SidebarButton";
import { AiFillHome, AiFillCalendar } from "react-icons/ai";
import { FaHome, FaCalendar, FaRobot } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="flex flex-col space-y-4 sticky top-10 h-[40vh] w-[20%] min-w-[200px] max-w-[300px] bg-base-100 shadow-br rounded-xl pt-4 pb-4 z-50">
      <SidebarButton href="/user/dashboard" icon={AiFillHome}>
        Dashboard
      </SidebarButton>
      <SidebarButton href="/user/appointments" icon={FaCalendar}>
        Appointments
      </SidebarButton>
      <SidebarButton href="/user/chatbot" icon={FaRobot}>
        Chatbot
      </SidebarButton>
    </div>
  );
};

export default Sidebar;
