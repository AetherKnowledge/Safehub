import Settings from "@/app/components/Settings/Settings";
import { getUser } from "@/app/components/Settings/SettingsActions";

const page = async () => {
  const user = await getUser();
  return <Settings user={user} />;
};

export default page;
