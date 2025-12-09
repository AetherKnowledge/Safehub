"use client";
import { UserType } from "@/app/generated/prisma/browser";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { IconType } from "react-icons";
import { AiFillHome } from "react-icons/ai";
import { FaCalendar, FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { IoChatboxEllipses, IoDocumentText } from "react-icons/io5";
import { MdFeedback } from "react-icons/md";
import { RiGeminiFill } from "react-icons/ri";

type NavItem = { href: string; Icon: IconType; label: string };

const getItemsForRole = (type?: UserType | null): NavItem[] => {
  if (type === UserType.Counselor) {
    return [
      { href: "/user/dashboard", Icon: AiFillHome, label: "Home" },
      { href: "/user/appointments", Icon: FaCalendar, label: "Appts" },
      { href: "/user/chats", Icon: IoChatboxEllipses, label: "Chats" },
      { href: "/user/feedback", Icon: MdFeedback, label: "Feedback" },
      { href: "/user/hotline", Icon: IoIosCall, label: "Hotline" },
    ];
  }

  if (type === UserType.Admin) {
    return [
      { href: "/user/dashboard", Icon: AiFillHome, label: "Home" },
      { href: "/user/users", Icon: FaUsers, label: "Users" },
      { href: "/user/chats", Icon: IoChatboxEllipses, label: "Chats" },
      { href: "/user/events", Icon: FaCalendar, label: "Events" },
      { href: "/user/hotline", Icon: IoIosCall, label: "Hotline" },
      { href: "/user/forms", Icon: IoDocumentText, label: "Forms" },
      { href: "/user/ai-management", Icon: RiGeminiFill, label: "AI" },
      { href: "/user/appointment-logs", Icon: FaClipboardList, label: "Logs" },
    ];
  }

  // Default to Student
  return [
    { href: "/user/dashboard", Icon: AiFillHome, label: "Home" },
    { href: "/user/counselors", Icon: FaUsers, label: "Counselors" },
    { href: "/user/appointments", Icon: FaCalendar, label: "Appts" },
    { href: "/user/chats", Icon: IoChatboxEllipses, label: "Chats" },
    { href: "/user/hotline", Icon: IoIosCall, label: "Hotline" },
  ];
};

const BottomBar = () => {
  const pathname = usePathname();
  const { data } = useSession();
  const items = getItemsForRole(data?.user?.type ?? null);

  return (
    <nav className="lg:hidden bg-gradient-to-r from-base-100 to-base-200/50 rounded-xl shadow-xl border border-base-content/5 z-20 backdrop-blur-sm">
      <ul className="flex items-center justify-center gap-1 overflow-x-auto px-2 py-2">
        {items.map(({ href, Icon, label }) => {
          const active = pathname?.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl min-w-[64px] transition-all duration-200 ${
                  active
                    ? "text-primary-content bg-primary shadow-md scale-105"
                    : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
                }`}
              >
                <Icon size={22} />
                <span
                  className={`text-[10px] leading-none font-medium ${
                    active ? "font-semibold" : ""
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomBar;
