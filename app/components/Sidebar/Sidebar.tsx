"use client";
import React, { useEffect, useState } from "react";
import SidebarButton from "./SidebarButton";
import { AiFillHome } from "react-icons/ai";
import { FaCalendar, FaRobot, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { UserType } from "@/app/generated/prisma"; // Adjust the import path as necessary
import { IoChatboxEllipses } from "react-icons/io5";

const Sidebar = () => {
  const [isLarge, setIsLarge] = useState(false);
  const session = useSession();

  useEffect(() => {
    const handleResize = () => setIsLarge(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!session.data?.user) {
    return null;
  }

  return (
    <motion.div
      animate={{ width: isLarge ? "25vw" : "2.5rem" }} // 2.5rem = w-10
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col space-y-4 sticky top-10 h-[40vh] min-w-[60px] max-w-[300px] bg-base-100 shadow-br rounded-xl pt-4 pb-4 z-50 overflow-hidden"
    >
      {session.data.user.type === UserType.Student
        ? studentSidebar()
        : session.data.user.type === UserType.Admin
        ? adminSidebar()
        : null}
    </motion.div>
  );
};

const studentSidebar = () => {
  return (
    <>
      <SidebarButton href="/user/dashboard" icon={AiFillHome}>
        Dashboard
      </SidebarButton>
      <SidebarButton href="/user/appointments" icon={FaCalendar}>
        Appointments
      </SidebarButton>
      <SidebarButton href="/user/chatbot" icon={FaRobot}>
        Chatbot
      </SidebarButton>
      <SidebarButton href="/user/chats" icon={IoChatboxEllipses}>
        Chats
      </SidebarButton>
    </>
  );
};

const adminSidebar = () => {
  return (
    <>
      <SidebarButton href="/user/dashboard" icon={AiFillHome}>
        Dashboard
      </SidebarButton>
      <SidebarButton href="/user/appointments" icon={FaCalendar}>
        Appointments
      </SidebarButton>
      <SidebarButton href="/user/users" icon={FaUsers}>
        Users
      </SidebarButton>
      <SidebarButton href="/user/chats" icon={IoChatboxEllipses}>
        Chats
      </SidebarButton>
    </>
  );
};

export default Sidebar;
