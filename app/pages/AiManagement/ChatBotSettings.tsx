"use client";
import Divider from "@/app/components/Divider";
import LoadingButton from "@/app/components/Input/LoadingButton";
import TextAreaMarkDown from "@/app/components/Input/TextAreaMarkDown";
import Toggle from "@/app/components/Input/Toggle";
import { usePopup } from "@/app/components/Popup/PopupProvider";
import { AiPreset } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { CiSaveDown2 } from "react-icons/ci";
import { FaPlus, FaTrash } from "react-icons/fa6";
import {
  addPreset,
  AiSettingsWithPreset,
  deletePreset,
  setAiPreset,
  toggleAiSetting,
  updatePreset,
} from "./AiManagementActions";
import { promptDefault } from "./schemas";

const ChatBotSettings = ({
  settings,
  presets,
}: {
  settings: AiSettingsWithPreset;
  presets: AiPreset[];
}) => {
  const statusPopup = usePopup();

  const [addingPreset, setAddingPreset] = useState(false);
  const [deletingPreset, setDeletingPreset] = useState(false);
  const [saving, setSaving] = useState(false);

  const [aiOn, setAiOn] = useState(true);
  const [currentPresets, setCurrentPresets] = useState<AiPreset[]>(presets);
  const [activePreset, setActivePreset] = useState<AiPreset | null>(
    settings.preset
  );
  const [whatAmI, setWhatAmI] = useState<string>(settings.preset.prompt);
  const [tasks, setTasks] = useState<string>(settings.preset.tasks || "");
  const [rules, setRules] = useState<string>(settings.preset.rules || "");
  const [limits, setLimits] = useState<string>(settings.preset.limits || "");
  const [examples, setExamples] = useState<string>(
    settings.preset.examples || ""
  );

  async function onChangeAiToggle(checked: boolean) {
    setAiOn(checked);
    await toggleAiSetting({ isAiOn: checked }).catch((e: Error) => {
      statusPopup.showError(e.message || "Failed to toggle AI setting.");
      setAiOn(!checked);
    });
  }

  async function handleAddPreset() {
    setAddingPreset(true);
    await addPreset({
      prompt: promptDefault,
    })
      .then((newPreset) => {
        setCurrentPresets((prev) => [...prev, newPreset]);
        setActivePreset(newPreset);
      })
      .catch((e: Error) => {
        statusPopup.showError(e.message || "Failed to add new preset.");
      })
      .finally(() => {
        setAddingPreset(false);
      });
  }
  async function handleDeletePreset() {
    if (!activePreset) return;

    setDeletingPreset(true);
    await deletePreset(activePreset.id)
      .then(() => {
        setCurrentPresets((prev) =>
          prev.filter((preset) => preset.id !== activePreset.id)
        );
        setActivePreset(currentPresets[0] || null);
      })
      .catch((e: Error) => {
        statusPopup.showError(e.message || "Failed to delete preset.");
      })
      .finally(() => {
        setDeletingPreset(false);
      });
  }

  useEffect(() => {
    setWhatAmI(activePreset?.prompt || "");
    setTasks(activePreset?.tasks || "");
    setRules(activePreset?.rules || "");
    setLimits(activePreset?.limits || "");
    setExamples(activePreset?.examples || "");
  }, [activePreset, presets]);

  async function onChangePreset(presetId: number) {
    const lastActive = activePreset;
    if (lastActive && lastActive.id === presetId) return;

    const preset = currentPresets.find((p) => p.id === presetId);
    setActivePreset(preset || null);

    await setAiPreset(presetId).catch((e: Error) => {
      statusPopup.showError(e.message || "Failed to change preset.");
      setActivePreset(lastActive);
    });
  }

  async function handleSave() {
    if (!activePreset) return;

    setSaving(true);
    // Simulate saving process
    await updatePreset({
      id: activePreset.id,
      name: activePreset.name,
      prompt: whatAmI,
      tasks,
      rules,
      limits,
    })
      .then((updatedPreset) => {
        setActivePreset(updatedPreset);
        setCurrentPresets((prev) =>
          prev.map((preset) =>
            preset.id === updatedPreset.id ? updatedPreset : preset
          )
        );
      })
      .catch((e: Error) => {
        statusPopup.showError(e.message || "Failed to update preset.");
      })
      .finally(() => {
        setSaving(false);
      });
  }

  return (
    <section className="flex-1 p-4 flex flex-col gap-4 min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">AI Chatbot</h2>
        <Toggle isChecked={aiOn} onToggle={onChangeAiToggle} />
      </div>

      <Divider />

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Presets</h3>
          <div className="flex gap-2">
            <LoadingButton
              isLoading={addingPreset}
              onClick={handleAddPreset}
              buttonType="outline"
              text="Add"
              buttonSize="sm"
              Icon={<FaPlus />}
            />
            <LoadingButton
              isLoading={deletingPreset}
              onClick={handleDeletePreset}
              buttonType="outline"
              text="Delete"
              buttonSize="sm"
              Icon={<FaTrash />}
              buttonColor="error"
              loadingText="Deleting..."
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onChangePreset(preset.id)}
              className={`btn btn-sm ${
                activePreset?.id === preset.id ? "btn-primary" : "btn-ghost"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-2 min-h-0 mt-2">
        <h2 className="font-semibold">System Prompt</h2>

        <div className="flex flex-col overflow-y-auto p-6 pt-2 border border-base-300/50 rounded-xl gap-6">
          <TextAreaMarkDown
            name="prompt"
            legend="What am I?"
            placeholder="e.g., A helpful AI chatbot assistant"
            bgColor="bg-white"
            value={whatAmI}
            onChange={(e) => setWhatAmI(e.target.value)}
            required
          />
          <TextAreaMarkDown
            name="tasks"
            legend="What’s my tasks?"
            placeholder="e.g., To assist the students"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            bgColor="bg-white"
          />
          <TextAreaMarkDown
            name="rules"
            legend="Rules"
            placeholder="e.g., All responses must be humane mentally & emotionally"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            bgColor="bg-white"
          />

          <TextAreaMarkDown
            name="limits"
            legend="Limitations"
            placeholder="e.g., Cannot provide medical advice"
            value={limits}
            onChange={(e) => setLimits(e.target.value)}
            bgColor="bg-white"
          />
          <TextAreaMarkDown
            name="examples"
            legend="Examples"
            placeholder="e.g., A user asking about their account balance"
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            bgColor="bg-white"
          />
        </div>
      </div>

      <LoadingButton
        isLoading={saving}
        onClick={handleSave}
        Icon={<CiSaveDown2 className="h-5 w-5" />}
        text="Save"
        loadingText="Saving..."
      />
    </section>
  );
};

export default ChatBotSettings;
