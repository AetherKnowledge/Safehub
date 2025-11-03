import { getMCPFiles, getPresets, getSettings } from "./AiManagementActions";
import ChatbotSandbox from "./ChatbotSandbox";
import ChatBotSettings from "./ChatBotSettings";
import MCPSettings from "./MCPSettings";

const AiManagement = async () => {
  const settings = await getSettings();
  const presets = (await getPresets()).sort((a, b) => a.id - b.id);
  const mcpFiles = await getMCPFiles();

  return (
    <div className="flex-1 flex bg-base-100 min-h-0 rounded-xl shadow-br">
      <div className="grid grid-cols-1 md:grid-cols-3 min-h-0">
        <ChatBotSettings settings={settings} presets={presets} />

        <ChatbotSandbox />

        <MCPSettings settings={settings} mcpFiles={mcpFiles} />
      </div>
    </div>
  );
};

export default AiManagement;
