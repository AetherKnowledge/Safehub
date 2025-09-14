"use client";
import { UserType } from "@/app/generated/prisma"; // Adjust the import path as necessary
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaCalendar, FaRobot, FaUsers } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";
import Divider from "../Divider";
import SafehubIcon from "../Icons/SafehubIcon";
import SidebarButton from "./SidebarButton";

const Sidebar = () => {
  const [isLarge, setIsLarge] = useState(true);
  const session = useSession();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsLarge(false); // only shrink, never grow back
      }
    };

    handleResize(); // run on mount
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
      className="flex flex-col space-y-4 sticky top-6 h-[93vh] min-w-[60px] max-w-[300px] bg-base-100 shadow-br rounded-lg pt-1 z-10 overflow-hidden"
    >
      <div className="flex w-full items-center justify-center pt-2">
        <SafehubIcon className="w-10 h-10" />
      </div>

      <div className="w-full px-3">
        <Divider className="w-full" />
      </div>

      {session.data.user.type === UserType.Student
        ? studentSidebar(isLarge)
        : session.data.user.type === UserType.Admin
        ? adminSidebar(isLarge)
        : session.data.user.type === UserType.Counselor
        ? counselorSidebar(isLarge)
        : null}

      <div className="w-full px-3">
        <Divider className="w-full" />
      </div>

      <SidebarButton
        href="/user/settings"
        icon={IoIosSettings}
        isLarge={isLarge}
      >
        Settings
      </SidebarButton>

      <motion.button
        className="flex items-center justify-center mb-4 text-base-content"
        onClick={() => setIsLarge(!isLarge)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      >
        <FaChevronRight className="w-6 h-6" />
      </motion.button>
    </motion.div>
  );
};

const studentSidebar = (isLarge: boolean) => {
  return (
    <>
      <SidebarButton href="/user/dashboard" icon={AiFillHome} isLarge={isLarge}>
        Dashboard
      </SidebarButton>
      <SidebarButton href="/user/counselors" icon={FaUsers} isLarge={isLarge}>
        Counselors
      </SidebarButton>
      <SidebarButton
        href="/user/appointments"
        icon={FaCalendar}
        isLarge={isLarge}
      >
        Appointments
      </SidebarButton>
      <SidebarButton href="/user/chatbot" icon={FaRobot} isLarge={isLarge}>
        Chatbot
      </SidebarButton>
      <SidebarButton
        href="/user/chats"
        icon={IoChatboxEllipses}
        isLarge={isLarge}
      >
        Chats
      </SidebarButton>
    </>
  );
};

const counselorSidebar = (isLarge: boolean) => {
  return (
    <>
      <SidebarButton href="/user/dashboard" icon={AiFillHome} isLarge={isLarge}>
        Dashboard
      </SidebarButton>
      <SidebarButton
        href="/user/appointments"
        icon={FaCalendar}
        isLarge={isLarge}
      >
        Appointments
      </SidebarButton>
      <SidebarButton
        href="/user/chats"
        icon={IoChatboxEllipses}
        isLarge={isLarge}
      >
        Chats
      </SidebarButton>
    </>
  );
};
const adminSidebar = (isLarge: boolean) => {
  return (
    <>
      <SidebarButton href="/user/dashboard" icon={AiFillHome} isLarge={isLarge}>
        Dashboard
      </SidebarButton>
      <SidebarButton
        href="/user/appointments"
        icon={FaCalendar}
        isLarge={isLarge}
      >
        Appointments
      </SidebarButton>
      <SidebarButton href="/user/users" icon={FaUsers} isLarge={isLarge}>
        Users
      </SidebarButton>
      <SidebarButton
        href="/user/chats"
        icon={IoChatboxEllipses}
        isLarge={isLarge}
      >
        Chats
      </SidebarButton>
      <SidebarButton href="/user/events" icon={FaCalendar} isLarge={isLarge}>
        Events
      </SidebarButton>
    </>
  );
};

export default Sidebar;
