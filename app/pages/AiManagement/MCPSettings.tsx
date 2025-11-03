"use client";
import Divider from "@/app/components/Divider";
import Toggle from "@/app/components/Input/Toggle";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { AiSettings, Tools } from "@/app/generated/prisma";
import { useMemo, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { toggleAiSetting, updateToolSettings } from "./AiManagementActions";

type ToolToggle = {
  key: string;
  label: string;
  enabled: boolean;
};

type FileCard = {
  id: string;
  name: string;
  preview?: string; // url
  source?: string; // hostname or small subtitle
};

const MCPSettings = ({ settings }: { settings: AiSettings }) => {
  const statusPopup = usePopup();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Right panel tools/files
  const [mcpOn, setMcpOn] = useState(settings.isMCPOn);
  const [tools, setTools] = useState<ToolToggle[]>(getTools(settings));

  const [cards, setCards] = useState<FileCard[]>([
    {
      id: crypto.randomUUID(),
      name: "PubMed Central",
      source: "harvey.com/pub...",
    },
    { id: crypto.randomUUID(), name: "Articles", source: "langworth.info/..." },
    {
      id: crypto.randomUUID(),
      name: "Awareness importance",
      source: "breitenberg.org/...",
    },
    {
      id: crypto.randomUUID(),
      name: "Calm Mind Blog",
      source: "konopelski.com/...",
    },
  ]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
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

  function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    const newCards: FileCard[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      preview: URL.createObjectURL(f),
      source: "uploaded",
    }));
    setCards((prev) => [...newCards, ...prev]);
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

      <div className="bg-white rounded-xl flex flex-col m-4 mt-0">
        <div className="flex items-center justify-between p-3">
          <h3 className="font-medium">Files</h3>
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload Files
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
        />

        <Divider />

        <div className="grid grid-cols-2 gap-3 p-3">
          {pagedCards.map((c) => (
            <div key={c.id} className="card bg-base-100 shadow-sm">
              <div className="card-body p-3 gap-2">
                <div className="flex items-start justify-between gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={!!selected[c.id]}
                      onChange={(e) =>
                        setSelected((s) => ({
                          ...s,
                          [c.id]: e.target.checked,
                        }))
                      }
                    />
                  </label>
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-ghost btn-xs"
                    >
                      ⋮
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-40 p-2 shadow"
                    >
                      <li>
                        <button
                          type="button"
                          onClick={() =>
                            setSelected((s) => ({ ...s, [c.id]: !s[c.id] }))
                          }
                        >
                          Select
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() =>
                            setCards((prev) =>
                              prev.filter((x) => x.id !== c.id)
                            )
                          }
                        >
                          Delete
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="w-full h-24 rounded bg-base-300 overflow-hidden flex items-center justify-center">
                  {c.preview ? (
                    <img
                      src={c.preview}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs opacity-60">No preview</span>
                  )}
                </div>
                <div className="text-sm font-medium truncate" title={c.name}>
                  {c.name}
                </div>
                <div className="text-xs opacity-60 truncate" title={c.source}>
                  {c.source}
                </div>
              </div>
            </div>
          ))}
        </div>

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

export default MCPSettings;
