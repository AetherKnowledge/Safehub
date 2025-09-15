"use client";
import { AnimatePresence, motion } from "motion/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface ButtonProps {
  isLarge: boolean;
  onClick?: () => void;
}

const CollapseButton = ({ isLarge, onClick }: ButtonProps) => {
  const text = "Collapse";

  const color = isLarge
    ? "text-primary"
    : "text-base-content hover:text-base-content/70";

  return (
    <motion.div
      className={"relative w-full " + color}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
    >
      <div
        className={
          "flex items-center justify-start gap-3 px-4 py-2 w-full text-left font-medium rounded-md cursor-pointer"
        }
      >
        {/** Replace the icon rendering block */}
        <AnimatePresence mode="wait" initial={false}>
          {isLarge ? (
            <motion.div
              key="chevron-left"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronLeft className="w-7 h-7 shrink-0 antialiased" />
            </motion.div>
          ) : (
            <motion.div
              key="chevron-right"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <FaChevronRight className="w-7 h-7 shrink-0 antialiased" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isLarge && (
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
      </div>
    </motion.div>
  );
};

export default CollapseButton;
