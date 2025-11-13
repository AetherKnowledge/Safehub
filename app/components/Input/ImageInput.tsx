"use client";

import React, { useEffect, useRef, useState } from "react";
import InputInterface from "./InputInterface";

type ImageInputProps = InputInterface & {
  multiple?: boolean;
  accept?: string; // e.g., "image/*"
  onChange?: (items: Array<File | string>) => void;
  // Pre-existing images to show in the middle (can be File or URL)
  defaultValue?: Array<File | string>;
};

const ImageInput = ({
  name,
  legend = "Image",
  className,
  required = false,
  number,
  multiple = false,
  accept = "image/*",
  onChange,

  defaultValue,
}: ImageInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<
    { url: string; revoke?: () => void; from: "file" | "url"; file?: File }[]
  >([]);

  const openDialog = () => {
    // Clear value so selecting the same file again will still trigger onChange
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list);
    const selected = multiple ? arr : arr.slice(0, 1);

    // build previews from files
    const newPreviews = selected.map((f) => {
      const url = URL.createObjectURL(f);
      return {
        url,
        revoke: () => URL.revokeObjectURL(url),
        from: "file" as const,
        file: f,
      };
    });

    if (multiple) {
      setImages((prev) => {
        const next = [...prev, ...selected];
        return next;
      });
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else {
      // replace existing
      setImages(selected);
      setPreviews((prev) => {
        prev.forEach((p) => p.revoke?.());
        return newPreviews;
      });
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer?.files || null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Initialize previews from `initial`
  useEffect(() => {
    if (!defaultValue) return;
    setPreviews((prev) => {
      // cleanup old ones
      prev.forEach((p) => p.revoke?.());
      const items: {
        url: string;
        revoke?: () => void;
        from: "file" | "url";
        file?: File;
      }[] = [];
      const list = multiple ? defaultValue : defaultValue.slice(0, 1);
      for (const it of list) {
        if (typeof it === "string") {
          items.push({ url: it, from: "url" });
        } else {
          const url = URL.createObjectURL(it);
          items.push({
            url,
            revoke: () => URL.revokeObjectURL(url),
            from: "file",
            file: it,
          });
        }
      }
      return items;
    });
  }, []);

  // Notify parent when previews change (reflecting current kept URLs and selected files)
  useEffect(() => {
    if (!onChange) return;
    const items: Array<File | string> = previews.map((p) =>
      p.from === "file" && p.file ? p.file : p.url
    );
    onChange(items);
  }, [previews, onChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setPreviews((prev) => {
        prev.forEach((p) => p.revoke?.());
        return [];
      });
    };
  }, []);

  return (
    <fieldset className={`fieldset w-full ${className || ""}`}>
      <legend className="fieldset-legend pb-1 ml-1">
        {number ? number.toString() + ". " : ""} {legend}:
        <span className={required ? "text-error" : "hidden"}>*</span>
      </legend>

      {/* Dropzone */}
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDialog();
          }
        }}
        onClick={openDialog}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative w-full rounded-xl border transition-colors duration-150 h-28 flex items-center justify-center text-sm cursor-pointer ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-base-300 bg-base-100"
        }`}
      >
        <input
          ref={inputRef}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required}
          className="sr-only"
          onChange={(e) => {
            const list = e.target.files;
            handleFiles(list);
            // Reset the value so picking the same single file triggers change next time
            // (especially important when multiple is false and parent passes onChange)
            e.currentTarget.value = "";
          }}
        />

        {/* Preview */}
        {previews.length > 0 && (
          <div className="flex flex-row gap-2 p-3 w-full h-full place-items-center overflow-x-auto">
            {previews.slice(0, 6).map((p, idx) => (
              <div
                key={idx}
                className="relative w-full h-full flex items-center justify-center"
              >
                <img
                  src={p.url}
                  alt="preview"
                  className="max-h-16 w-full object-contain rounded pointer-events-none"
                />
                <button
                  type="button"
                  className="absolute -top-1 -right-1 btn btn-xs btn-circle btn-error"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviews((prev) => {
                      const next = [...prev];
                      const removed = next.splice(idx, 1)[0];
                      removed?.revoke?.();
                      return next;
                    });
                    setImages((prev) => {
                      if (p.from === "file" && p.file) {
                        const next = prev.filter((f) => f !== p.file);
                        return next;
                      }
                      return prev;
                    });
                  }}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className={`${
            previews.length > 0 && "absolute bottom-1 left-0 right-0"
          } text-center text-xs text-base-content/60 pointer-events-none`}
        >
          <span>Drag & Drop your files or </span>
          <span className="text-primary font-medium">Browse</span>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="mt-2 text-xs text-base-content/60 ml-1">
          {multiple
            ? "You can drag & drop more images or browse to add more. Click × on a thumbnail to remove."
            : "Click × to remove, or drag & drop/browse to replace the image."}
        </div>
      )}
    </fieldset>
  );
};

export default ImageInput;
