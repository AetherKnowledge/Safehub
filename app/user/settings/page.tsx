import Settings from "@/app/pages/Settings";
import { getUser } from "@/app/pages/Settings/SettingsActions";

const page = async () => {
  const user = await getUser();
  return <Settings user={user} />;
};

export default page;
