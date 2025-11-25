"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface ButtonProps {
  icon?: IconType;
  color?: string;
  children?: string;
  href: string;
  isLarge: boolean;
}

const SidebarButton = (props: ButtonProps) => {
  const location = usePathname();
  const isActive =
    location === props.href || location.startsWith(props.href + "/");
  const text = props.children || "Button";

  const color = isActive
    ? "text-primary-content bg-primary shadow-md"
    : "text-base-content/80 hover:text-base-content hover:bg-base-200/50";

  return buttonWithAnimatedText(props, color, isActive, text, props.isLarge);
};

function buttonWithAnimatedText(
  { href, icon: Icon }: ButtonProps,
  color: string,
  isActive: boolean,
  text: string,
  showText: boolean
): ReactNode {
  return (
    <motion.div
      className={"relative w-full transition-all"}
      whileHover={isActive ? {} : { scale: 1.02 }}
      whileTap={isActive ? {} : { scale: 0.98 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <Link
        href={href}
        className={
          "flex items-center justify-start gap-3 px-3 py-2.5 w-full text-left font-medium rounded-lg transition-all duration-200 " +
          color +
          (isActive ? " cursor-default" : "")
        }
      >
        {Icon && <Icon className="w-6 h-6 shrink-0 antialiased" />}
        <AnimatePresence>
          {showText && (
            <motion.div
              key="sidebar-text"
              initial={{ width: 0, opacity: 0, clipPath: "inset(0 0 0 100%)" }}
              animate={{
                width: "auto",
                opacity: 1,
                clipPath: "inset(0 0 0 0%)",
              }}
              exit={{
                width: 0,
                opacity: 0,
                clipPath: "inset(0 0 0 100%)",
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden whitespace-nowrap"
            >
              {text}
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

export default SidebarButton;
