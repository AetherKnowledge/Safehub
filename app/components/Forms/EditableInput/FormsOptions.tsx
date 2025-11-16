"use client";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";

const FormsOptions = ({
  onAdd,
  onAddSeparator,
  onMoveUp,
  onMoveDown,
  isHeader = false,
}: {
  onAdd?: () => void;
  onAddSeparator?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isHeader?: boolean;
}) => {
  return (
    <motion.div className="absolute right-[-75px] top-1/2 -translate-y-1/2 z-50">
      <motion.div
        layout
        layoutId="formsOptions"
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex flex-col bg-base-100 rounded-lg shadow-br p-2 w-15 gap-2 items-center"
      >
        {!isHeader && (
          <div className="tooltip tooltip-left">
            <div className="tooltip-content">
              <div className="text-sm">Move Question Up</div>
            </div>
            <button className="btn btn-ghost p-1 text-base-content/70">
              <FaChevronUp className="w-6 h-6" onClick={onMoveUp} />
            </button>
          </div>
        )}

        <div className="tooltip tooltip-left">
          <div className="tooltip-content">
            <div className="text-sm">Add Question</div>
          </div>
          <button className="btn btn-ghost p-1 text-base-content/70">
            <IoMdAddCircleOutline className="w-7 h-7" onClick={onAdd} />
          </button>
        </div>

        <div className="tooltip tooltip-left">
          <div className="tooltip-content">
            <div className="text-sm">Add Separator</div>
          </div>
          <button className="btn btn-ghost p-1 text-base-content/70">
            <TfiLayoutAccordionSeparated
              className="w-6 h-6"
              onClick={onAddSeparator}
            />
          </button>
        </div>

        {!isHeader && (
          <div className="tooltip tooltip-left">
            <div className="tooltip-content">
              <div className="text-sm">Move Question Down</div>
            </div>
            <button className="btn btn-ghost p-1 text-base-content/70">
              <FaChevronDown className="w-6 h-6" onClick={onMoveDown} />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default FormsOptions;
