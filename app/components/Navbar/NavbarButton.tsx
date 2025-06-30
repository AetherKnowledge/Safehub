"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

interface ButtonProps {
  color?: string;
  children?: string;
  href: string;
}

const NavbarButton = ({ children, href }: ButtonProps) => {
  const location = usePathname();
  const isActive = location === href || location.startsWith(href + "/");
  const text = children || "Button";

  const btnClass = isActive
    ? "btn-ghost text-base-content font-medium cursor-default"
    : "btn-ghost text-base-content font-medium hover:text-base-content/70";

  return (
    <motion.div
      className="inline-flex flex-col items-center text-shadow-br"
      whileHover={isActive ? {} : { scale: 1.05 }}
      whileTap={isActive ? {} : { scale: 0.95 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <div className="relative">
        <Link href={href} className={btnClass}>
          {text}
        </Link>
        {isActive && (
          <motion.div
            layoutId="navbar-underline"
            className="absolute left-0 right-0 -bottom-1 h-[5px] bg-base-content rounded-full shadow-br"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default NavbarButton;
