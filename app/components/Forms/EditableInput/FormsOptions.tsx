"use client";
import useIsMobile from "@/lib/socket/hooks/useMobile";
import usePrevious from "@/lib/socket/hooks/usePrevious";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";

type FormsOptionsProps = {
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
  const isMobile = useIsMobile();
  const prevIsMobile = usePrevious(isMobile);

  // Only animate if isMobile changed
  const shouldAnimate = prevIsMobile !== undefined && prevIsMobile !== isMobile;

  return (
    <AnimatePresence>
      {!isMobile && (
        <motion.div
          className="absolute right-[-75px] top-1/2 -translate-y-1/2 z-50"
          initial={shouldAnimate ? { opacity: 0, x: 20 } : false}
          animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
          exit={shouldAnimate ? { opacity: 0, x: 20 } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
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
      )}
    </AnimatePresence>
  );
};

export const FormOptionsBottom = ({
  onAdd,
  onAddSeparator,
  onMoveUp,
  onMoveDown,
  isHeader = false,
}: FormsOptionsProps) => {
  const isMobile = useIsMobile();

  return (
    <AnimatePresence>
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex flex-row bg-base-100 w-full rounded-lg shadow-br p-2 gap-2 items-center -mb-6">
            {!isHeader && (
              <div className="flex flex-col w-full items-center">
                <div className="tooltip tooltip-top">
                  <div className="tooltip-content">
                    <div className="text-sm">Move Question Up</div>
                  </div>
                  <button className="btn btn-ghost p-1 text-base-content/70">
                    <FaChevronUp className="w-6 h-6" onClick={onMoveUp} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col w-full items-center">
              <div className="tooltip tooltip-top">
                <div className="tooltip-content">
                  <div className="text-sm">Add Question</div>
                </div>
                <button className="btn btn-ghost p-1 text-base-content/70">
                  <IoMdAddCircleOutline className="w-7 h-7" onClick={onAdd} />
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full items-center">
              <div className="tooltip tooltip-top">
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
            </div>

            {!isHeader && (
              <div className="flex flex-col w-full items-center">
                <div className="tooltip tooltip-top">
                  <div className="tooltip-content">
                    <div className="text-sm">Move Question Down</div>
                  </div>
                  <button className="btn btn-ghost p-1 text-base-content/70">
                    <FaChevronDown className="w-6 h-6" onClick={onMoveDown} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormsOptions;
