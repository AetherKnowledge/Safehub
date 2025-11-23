import { ExtraOptions } from "@/app/components/Input/schema";
import SelectBox from "@/app/components/Input/SelectBox";
import VideoContainer from "@/app/components/Video/VideoContainer";
import { clearNotifications, testAction } from "./testActions";

const Test = async () => {
  return (
    <>
      <button className="btn" onClick={testAction}>
        Test Action
      </button>
      <button className="btn" onClick={clearNotifications}>
        Delete Action
      </button>
      <SelectBox
        name="test"
        options={[]}
        extraOptions={ExtraOptions.COUNSELOR_LIST}
      />
      <div className="flex-1 flex flex-row"></div>
      <VideoContainer isLocalStream={true} stream={null} />
    </>
  );
};

export default Test;
