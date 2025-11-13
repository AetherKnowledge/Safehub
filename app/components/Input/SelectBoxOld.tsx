"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoMdArrowDropdown } from "react-icons/io";

interface SelectBoxOldProps {
  items: string[];
  placeholder?: string;
  queryKey?: string;
  onSelect?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  padding?: string;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  colorMap?: Record<string, { bg: string; text: string }>;
}

export default function SelectBoxOld({
  items,
  placeholder = "Select an option",
  onSelect,
  className = "",
  defaultValue,
  queryKey,
  padding = "pr-2 py-1",
  borderColor = "border-base-300",
  bgColor = "bg-neutral",
  textColor = "text-base-content",
  colorMap,
}: SelectBoxOldProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(defaultValue ?? null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [dropdownStyles, setDropdownStyles] =
    useState<React.CSSProperties | null>(null);

  const selectedStyles =
    selected && colorMap?.[selected]
      ? `${colorMap[selected].bg} ${colorMap[selected].text}`
      : `${bgColor ?? "bg-base-100"} ${textColor ?? "text-base-content"}`;

  function handleSearchChange(queryKey: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(queryKey, value);
    } else {
      params.delete(value);
    }
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  }

  function handleSelect(item: string) {
    setSelected(item);
    onSelect?.(item);
    if (queryKey) handleSearchChange(queryKey, item);
    setOpen(false);
  }

  // Calculate dropdown position when opened
  useLayoutEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyles({
        position: "absolute",
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      <div
        ref={triggerRef}
        className={`relative border rounded-xl shadow-sm ${className} ${selectedStyles} ${borderColor}`}
      >
        <div className={`flex justify-center items-center ${padding}`}>
          <button onClick={() => setOpen((prev) => !prev)} className="w-full">
            {selected && selected !== defaultValue ? selected : placeholder}
          </button>
          <IoMdArrowDropdown
            className="text-xl cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
      </div>

      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && dropdownStyles && (
              <motion.ul
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                style={dropdownStyles}
                className="bg-base-100 border border-base-300 rounded-xl shadow-md"
              >
                {items.map((item) => (
                  <li
                    key={item}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-2 cursor-pointer hover:bg-base-200 text-base-content text-sm"
                  >
                    {item}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
