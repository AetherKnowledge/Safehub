"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { IconType } from "react-icons";

interface ButtonProps {
  icon?: IconType;
  color?: string;
  children?: string;
  href: string;
}

const SidebarButton = ({ children, href, icon: Icon }: ButtonProps) => {
  const location = usePathname();
  const isActive = location === href || location.startsWith(href + "/");
  const text = children || "Button";

  const btnClass =
    "flex items-center justify-start gap-3 px-4 py-2 w-full text-left font-medium rounded-md " +
    (isActive
      ? "text-base-content cursor-default"
      : "text-base-content hover:text-base-content/70");

  const iconClass =
    "w-7 h-7 shrink-0 antialiased" +
    (isActive ? " text-primary" : " text-base-content");

  return (
    <motion.div
      className="relative w-full"
      whileHover={isActive ? {} : { scale: 1.02 }}
      whileTap={isActive ? {} : { scale: 0.98 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <Link href={href} className={btnClass}>
        {Icon && <Icon className={iconClass} />}
        {text}
      </Link>

      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute right-0 top-0 h-full w-[4px] bg-primary rounded-l"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </motion.div>
  );
};

export default SidebarButton;
