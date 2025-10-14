"use client";
import { UserType } from "@/app/generated/prisma"; // Adjust the import path as necessary
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaCalendar, FaUsers } from "react-icons/fa";
import { IoIosCall, IoIosSettings } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdFeedback } from "react-icons/md";
import Divider from "../Divider";
import CollapseButton from "./CollapseButton";
import SidebarButton from "./SidebarButton";
import SidebarLogo from "./SidebarLogo";

const Sidebar = () => {
  const [isLarge, setIsLarge] = useState(false);
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

  return (
    <motion.div
      animate={{ width: isLarge ? "185px" : "60px" }}
      initial={{ width: isLarge ? "185px" : "60px" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col justify-between sticky pt-1 top-0 h-[calc(100vh-3rem)] min-w-[60px] max-w-[185px] bg-base-100 shadow-br rounded-lg z-10 overflow-x-hidden overflow-y-auto"
    >
      {/* Top Section */}
      <div className="flex flex-col items-center space-y-4">
        <SidebarLogo isLarge={isLarge} />

        <div className="w-full px-3">
          <Divider className="w-full" />
        </div>

        {session.data?.user.type === UserType.Student
          ? studentSidebar(isLarge)
          : session.data?.user.type === UserType.Admin
          ? adminSidebar(isLarge)
          : session.data?.user.type === UserType.Counselor
          ? counselorSidebar(isLarge)
          : studentSidebar(isLarge)}

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
      </div>

      {/* Bottom Section */}
      <div className="pb-2">
        <CollapseButton
          isLarge={isLarge}
          onClick={() => setIsLarge(!isLarge)}
        />
      </div>
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
      <SidebarButton
        href="/user/chats"
        icon={IoChatboxEllipses}
        isLarge={isLarge}
      >
        Chats
      </SidebarButton>
      <SidebarButton href="/user/hotline" icon={IoIosCall} isLarge={isLarge}>
        Hotline
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
      <SidebarButton href="/user/feedback" icon={MdFeedback} isLarge={isLarge}>
        Feedback
      </SidebarButton>
      <SidebarButton href="/user/hotline" icon={IoIosCall} isLarge={isLarge}>
        Hotline
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
      <SidebarButton href="/user/hotline" icon={IoIosCall} isLarge={isLarge}>
        Hotline
      </SidebarButton>
    </>
  );
};

export default Sidebar;
