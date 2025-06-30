"use client";
import React, { useEffect, useState } from "react";
import SidebarButton from "./SidebarButton";
import { AiFillHome } from "react-icons/ai";
import { FaCalendar, FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsLarge(window.innerWidth >= 1024); // 1024px = Tailwind's 'lg'
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      animate={{ width: isLarge ? "25vw" : "2.5rem" }} // 2.5rem = w-10
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col space-y-4 sticky top-10 h-[40vh] min-w-[60px] max-w-[300px] bg-base-100 shadow-br rounded-xl pt-4 pb-4 z-50 overflow-hidden"
    >
      <SidebarButton href="/user/dashboard" icon={AiFillHome}>
        Dashboard
      </SidebarButton>
      <SidebarButton href="/user/appointments" icon={FaCalendar}>
        Appointments
      </SidebarButton>
      <SidebarButton href="/user/chatbot" icon={FaRobot}>
        Chatbot
      </SidebarButton>
    </motion.div>
  );
};

export default Sidebar;
