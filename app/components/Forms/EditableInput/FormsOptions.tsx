"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";

export type FormsOptionsProps = {
  onAdd?: () => void;
  onAddSeparator?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isHeader?: boolean;
};

const FormsOptions = ({
  onAdd,
  onAddSeparator,
  onMoveUp,
  onMoveDown,
  isHeader = false,
}: FormsOptionsProps) => {
  return (
    <AnimatePresence initial={false}>
      <motion.div className="absolute right-[-75px] top-1/2 -translate-y-1/2 z-50 hidden xl:flex">
        <motion.div
          layout="position"
          layoutId="formsOptions"
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col bg-base-100 rounded-lg shadow-br p-2 w-15 gap-2 items-center"
        >
          {!isHeader && (
            <div className="tooltip tooltip-left">
              <button className="btn btn-ghost p-1 text-base-content/70">
                <FaChevronUp className="w-6 h-6" onClick={onMoveUp} />
              </button>
            </div>
          )}

          <div className="tooltip tooltip-left">
            <button className="btn btn-ghost p-1 text-base-content/70">
              <IoMdAddCircleOutline className="w-7 h-7" onClick={onAdd} />
            </button>
          </div>

          <div className="tooltip tooltip-left">
            <button className="btn btn-ghost p-1 text-base-content/70">
              <TfiLayoutAccordionSeparated
                className="w-6 h-6"
                onClick={onAddSeparator}
              />
            </button>
          </div>

          {!isHeader && (
            <div className="tooltip tooltip-left">
              <button className="btn btn-ghost p-1 text-base-content/70">
                <FaChevronDown className="w-6 h-6" onClick={onMoveDown} />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FormsOptions;
