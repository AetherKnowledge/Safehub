"use client";
import Divider from "@/app/components/Divider";
import Toggle from "@/app/components/Input/Toggle";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { AiSettings, MCPFile, Tools } from "@/app/generated/prisma";
import { useSession } from "next-auth/react";
import { useMemo, useRef, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";
import {
  deleteFileFromMCP,
  toggleAiSetting,
  updateToolSettings,
  uploadFileToMCP,
} from "./AiManagementActions";
import FileCard from "./FileCard";
import { UploadMCPFileData } from "./schemas";

type ToolToggle = {
  key: string;
  label: string;
  enabled: boolean;
};

const MCPSettings = ({
  settings,
  mcpFiles,
}: {
  settings: AiSettings;
  mcpFiles: MCPFile[];
}) => {
  const session = useSession();
  const statusPopup = usePopup();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Right panel tools/files
  const [mcpOn, setMcpOn] = useState(settings.isMCPOn);
  const [tools, setTools] = useState<ToolToggle[]>(getTools(settings));

  const [cards, setCards] = useState<MCPFile[]>(mcpFiles);
  const [selectedCards, setSelectedCards] = useState<Set<MCPFile>>(new Set());

  const [perPage, setPerPage] = useState(4);
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(cards.length / perPage)),
    [cards.length, perPage]
  );
  const pagedCards = useMemo(() => {
    const start = (page - 1) * perPage;
    return cards.slice(start, start + perPage);
  }, [cards, page, perPage]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    statusPopup.showLoading("Uploading files...");
    const toUpload: UploadMCPFileData[] = Array.from(files).map(
      (file) =>
        ({
          name: file.name,
          file,
        }) as UploadMCPFileData
    );

    let mcpFiles: MCPFile[] = [];

    try {
      mcpFiles = await Promise.all(
        toUpload.map(async (file) => await uploadFileToMCP(file))
      );

      statusPopup.showSuccess("Files uploaded successfully.");
      setCards((prev) => [...mcpFiles, ...prev]);
    } catch (e) {
      const err = e as Error;
      statusPopup.showError(err.message || "Failed to upload files.");
    }
  }

  async function handleDelete(files: MCPFile[]) {
    if (files.length === 0) return;
    const confirmed = await statusPopup.showYesNo(
      "Are you sure you want to delete the selected files?"
    );
    if (!confirmed) {
      return;
    }

    statusPopup.showLoading("Deleting files...");
    try {
      await Promise.all(
        files.map(async (file) => await deleteFileFromMCP(file.id))
      );

      statusPopup.showSuccess("Files deleted successfully.");
      setCards((prev) => prev.filter((card) => !files.includes(card)));
      setSelectedCards(new Set());
    } catch (e) {
      const err = e as Error;
      statusPopup.showError(err.message || "Failed to delete files.");
    }
  }

  async function onToggleMcp(checked: boolean) {
    setMcpOn(checked);
    await toggleAiSetting({ isMCPOn: checked }).catch((e: Error) => {
      statusPopup.showError(e.message || "Failed to toggle AI setting.");
      setMcpOn(!checked);
    });
  }

  async function onToggleTool(toolKey: string, enabled: boolean) {
    setTools((prev) =>
      prev.map((t) =>
        t.key === toolKey ? { ...t, enabled: enabled } : { ...t }
      )
    );
    await updateToolSettings({ tool: toolKey, enabled }).catch((e: Error) => {
      statusPopup.showError(e.message || "Failed to toggle tool setting.");
      setTools((prev) =>
        prev.map((t) =>
          t.key === toolKey ? { ...t, enabled: !enabled } : { ...t }
        )
      );
    });
  }

  function handleDownload(files: MCPFile[]) {
    files.map((card) => {
      console.log("Download URL " + card.url);
      if (!session.data?.supabaseAccessToken) {
        statusPopup.showError("You must be logged in to download files.");
        return;
      }

      downloadFile(card.url, card.name, session.data.supabaseAccessToken);
    });
  }

  return (
    <section className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-bold">MCP Server</h2>
        <Toggle isChecked={mcpOn} onToggle={onToggleMcp} />
      </div>

      <Divider />

      <div className="m-4">
        <h3 className="font-semibold mb-2">Tools</h3>
        <ul className="p-2 pt-0 space-y-2">
          {tools.map((tool) => (
            <li key={tool.key} className="flex items-center justify-between">
              <span>{tool.label}</span>
              <Toggle
                isChecked={mcpOn && tool.enabled}
                onToggle={(checked) => onToggleTool(tool.key, checked)}
                disabled={!mcpOn}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-neutral rounded-xl flex flex-col m-4 mt-0">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-medium">Files</h3>
          <div className="flex flex-row gap-2">
            <button
              className="btn btn-sm btn-primary"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Files
            </button>
            <div className="dropdown dropdown-end">
              <BsThreeDotsVertical
                role="button"
                tabIndex={0}
                className="cursor-pointer btn btn-ghost btn-sm p-1"
              />
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow"
              >
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCards.size > 0) {
                        setSelectedCards(new Set());
                      } else {
                        setSelectedCards(new Set(cards));
                      }
                    }}
                  >
                    {selectedCards.size > 0 ? "Unselect All" : "Select All"}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleDelete(Array.from(selectedCards));
                    }}
                  >
                    Delete Selected
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      handleDownload(Array.from(selectedCards));
                    }}
                  >
                    Download Selected
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept=".pdf,.docx"
          onChange={(e) => handleUpload(e.target.files)}
        />

        <Divider />

        {cards.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-3">
            {pagedCards.map((card) => (
              <FileCard
                key={card.id}
                file={card}
                selected={selectedCards.has(card)}
                onSelect={(file, selected) => {
                  setSelectedCards((prev) => {
                    const newSet = new Set(prev);
                    if (selected) {
                      newSet.add(file);
                    } else {
                      newSet.delete(file);
                    }
                    return newSet;
                  });
                }}
                onDelete={(file) => {
                  handleDelete([file]);
                }}
                onDownload={(file) => {
                  handleDownload([file]);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex w-full text-center items-center justify-center text-base-content/70 h-51">
            No files uploaded.
          </div>
        )}

        <Divider />

        <div className="flex items-center justify-between p-2">
          <button
            className="btn btn-ghost btn-primary btn-sm"
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>

          <div className="flex items-center border border-base-content/20 rounded-md overflow-hidden w-fit">
            <span className="text-sm px-3 py-1.5 text-base-content/70 border-r border-base-content/20">
              Per page
            </span>

            <div className="relative">
              <select
                className="text-sm px-2 py-1.5 pr-6 focus:outline-none appearance-none bg-base-100 text-base-content/90"
                value={perPage}
                onChange={(e) => {
                  setPerPage(parseInt(e.target.value));
                  setPage(1);
                }}
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>

              <FaAngleDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-base-content/70" />
            </div>
          </div>

          <button
            className="btn btn-ghost btn-primar btn-sm"
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

function getTools(settings: AiSettings): ToolToggle[] {
  return Object.values(Tools).map((tool) => {
    // Create a readable label
    let label = tool.replace(/([A-Z])/g, " $1").trim();

    // Remove "Get " prefix if present
    label = label.replace(/^Get\s+/i, "");

    // Rename "Query Vault" to "File Search"
    if (label === "Query Vault") label = "File Search";

    return {
      key: tool,
      label,
      enabled: settings.tools.includes(tool),
    } as ToolToggle;
  });
}

async function downloadFile(
  url: string,
  filename: string,
  sessionToken: string
) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch file.");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("File download failed:", err);
  }
}

export default MCPSettings;
