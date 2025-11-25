import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdOutlineIntegrationInstructions } from "react-icons/md";
import { RiRobot2Line } from "react-icons/ri";
import { getMCPFiles, getPresets, getSettings } from "./AiManagementActions";
import AiManagementTab from "./AiManagementTab";
import ChatbotSandbox from "./ChatbotSandbox";
import ChatBotSettings from "./ChatBotSettings";
import MCPSettings from "./MCPSettings";

const AiManagement = async () => {
  const settings = await getSettings();
  const presets = (await getPresets()).sort((a, b) => a.id - b.id);
  const mcpFiles = await getMCPFiles();

  return (
    <div className="tabs tabs-lift h-full min-h-0">
      <AiManagementTab
        title="Chatbot Settings"
        icon={<RiRobot2Line />}
        groupName="ai-tabs"
        defaultChecked={true}
      >
        <ChatBotSettings settings={settings} presets={presets} />
      </AiManagementTab>

      <AiManagementTab
        title="Test Sandbox"
        icon={<IoChatboxEllipsesOutline />}
        groupName="ai-tabs"
      >
        <ChatbotSandbox />
      </AiManagementTab>

      <AiManagementTab
        title="MCP Server"
        icon={<MdOutlineIntegrationInstructions />}
        groupName="ai-tabs"
      >
        <MCPSettings settings={settings} mcpFiles={mcpFiles} />
      </AiManagementTab>
    </div>
  );
};

export default AiManagement;
