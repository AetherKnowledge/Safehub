"use client";

import useIsMobile from "@/lib/socket/hooks/useMobile";
import { AnimatePresence, motion } from "motion/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TfiLayoutAccordionSeparated } from "react-icons/tfi";
import { FormsOptionsProps } from "./EditableInput/FormsOptions";

const EditableFormHeader = ({
  onSave,
  changeTerms,
  termsAndConditions,
  selectedComponent,
  onAdd,
  onAddSeparator,
  onMoveUp,
  onMoveDown,
  isHeader = false,
}: {
  onSave?: () => void;
  changeTerms?: (value: boolean) => void;
  termsAndConditions?: boolean;
  selectedComponent?: string;
} & FormsOptionsProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-row bg-base-100 w-full justify-end items-center p-2 gap-2 rounded-t-lg">
      {selectedComponent && (
        <AnimatePresence>
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex flex-row bg-base-100 w-full rounded-none p-2 gap-2 items-center">
                {!isHeader && (
                  <div className="flex flex-col w-full items-center">
                    <div className="tooltip tooltip-bottom">
                      <div className="tooltip-content">
                        <div className="text-sm">Move Question Up</div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost p-1 text-base-content/70"
                      >
                        <FaChevronUp className="w-6 h-6" onClick={onMoveUp} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col w-full items-center">
                  <div className="tooltip tooltip-bottom">
                    <div className="tooltip-content">
                      <div className="text-sm">Add Question</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost p-1 text-base-content/70"
                    >
                      <IoMdAddCircleOutline
                        className="w-7 h-7"
                        onClick={onAdd}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col w-full items-center">
                  <div className="tooltip tooltip-bottom">
                    <div className="tooltip-content">
                      <div className="text-sm">Add Separator</div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost p-1 text-base-content/70"
                    >
                      <TfiLayoutAccordionSeparated
                        className="w-6 h-6"
                        onClick={onAddSeparator}
                      />
                    </button>
                  </div>
                </div>

                {!isHeader && (
                  <div className="flex flex-col w-full items-center">
                    <div className="tooltip tooltip-bottom">
                      <div className="tooltip-content">
                        <div className="text-sm">Move Question Down</div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost p-1 text-base-content/70"
                      >
                        <FaChevronDown
                          className="w-6 h-6"
                          onClick={onMoveDown}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <div className="flex flex-row w-full justify-end items-center gap-2">
        <label className="label text-base-content">
          <input
            type="checkbox"
            className="checkbox rounded-lg"
            checked={termsAndConditions}
            onChange={(e) => changeTerms?.(e.target.checked)}
          />
          Show Terms and Conditions
        </label>
        <button className="btn btn-ghost" onClick={onSave}>
          Save Form
        </button>
      </div>
    </div>
  );
};

export default EditableFormHeader;
