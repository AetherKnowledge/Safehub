"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

interface SelectBoxProps {
  items: string[];
  placeholder?: string;
  queryKey?: string;
  onSelect?: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
}

export default function SelectBox({
  items,
  placeholder = "Select an option",
  onSelect,
  className = "",
  defaultValue,
  queryKey,
}: SelectBoxProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  function handleSearchChange(queryKey: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(queryKey, value);
    } else {
      params.delete(value);
    }
    router.push(`${pathName}?${params.toString()}`, { scroll: false });
  }

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null); // 👈 create a ref for the box

  function handleSelect(item: string) {
    setSelected(item);
    onSelect && onSelect(item);
    if (queryKey) handleSearchChange(queryKey, item);
    setOpen(false);
  }

  // 👇 Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={boxRef} className={`relative w-f ${className}`}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="px-4 py-2 w-full bg-base-100 border border-base-300 rounded-xl text-base-content shadow-sm text-left"
      >
        {selected && selected !== defaultValue ? selected : placeholder}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 mt-2 w-full bg-base-100 border border-base-300 rounded-xl shadow-br z-50"
          >
            {items.map((item) => (
              <li
                key={item}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 cursor-pointer hover:bg-base-200 text-base-content"
              >
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
