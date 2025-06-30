"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { IconType } from "react-icons";
import { ReactNode, useEffect, useState } from "react";

interface ButtonProps {
  icon?: IconType;
  color?: string;
  children?: string;
  href: string;
}

const SidebarButton = (props: ButtonProps) => {
  const location = usePathname();
  const isActive =
    location === props.href || location.startsWith(props.href + "/");
  const text = props.children || "Button";

  const color = isActive
    ? "text-primary"
    : "text-base-content hover:text-base-content/70";

  const isLarge = useIsLargeScreen();

  return buttonWithAnimatedText(props, color, isActive, text, isLarge);
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
      className={"relative w-full " + color}
      whileHover={isActive ? {} : { scale: 1.02 }}
      whileTap={isActive ? {} : { scale: 0.98 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
    >
      <Link
        href={href}
        className={
          "flex items-center justify-start gap-3 px-4 py-2 w-full text-left font-medium rounded-md " +
          (isActive && "cursor-default")
        }
      >
        {Icon && <Icon className="w-7 h-7 shrink-0 antialiased" />}
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

      {isActive && (
        <motion.div
          layoutId="sidebar-indicator"
          className="absolute right-0 top-0 h-full w-[4px] bg-primary rounded-l"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </motion.div>
  );
}

export function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsLarge(window.innerWidth >= 1024);
    checkScreen();

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isLarge;
}

export default SidebarButton;
