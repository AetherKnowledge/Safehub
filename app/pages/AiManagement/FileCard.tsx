"use client";
import NoImage from "@/app/components/Images/NoImage";
import { MCPFile } from "@/app/generated/prisma";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import FilePreviewModal from "./FilePreviewModal";

type FileCardProps = {
  file: MCPFile;
  selected?: boolean;
  onSelect?: (file: MCPFile, selected: boolean) => void;
  onDelete?: (file: MCPFile) => void;
  onDownload?: (file: MCPFile) => void;
};

const FileCard = ({
  file,
  onDelete,
  selected = false,
  onSelect,
  onDownload,
}: FileCardProps) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);

  function onSelectChange(selected: boolean) {
    onSelect && onSelect(file, selected);
  }

  return (
    <div key={file.id} className="card bg-base-100 shadow-sm">
      <div className="card-body p-3 gap-2">
        <div className="flex items-start justify-between gap-2">
          <label className="cursor-pointer">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={selected}
              onChange={(e) => onSelectChange(e.target.checked)}
            />
          </label>
          <div className="dropdown dropdown-end">
            <BsThreeDotsVertical
              tabIndex={0}
              role="button"
              className="cursor-pointer btn btn-ghost btn-xs p-1"
            />
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow"
            >
              <li>
                <button type="button" onClick={() => onSelectChange(!selected)}>
                  Select
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(file)}
                >
                  Delete
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onDownload && onDownload(file)}
                >
                  Download
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div
          className="w-full h-24 rounded bg-base-300 overflow-hidden flex items-center justify-center cursor-pointer"
          onClick={() => {
            setShowPreview(true);
          }}
        >
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <NoImage className="rounded-sm" text="No Preview" />
          )}
        </div>
        <div className="text-sm font-medium truncate" title={file.name}>
          {file.name}
        </div>
      </div>
      {showPreview && (
        <FilePreviewModal
          src={file.url}
          onClose={() => {
            console.log("hello");
            setShowPreview(false);
          }}
        />
      )}
    </div>
  );
};

export default FileCard;
