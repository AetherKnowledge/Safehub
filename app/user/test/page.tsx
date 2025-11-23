import SelectBox from "@/app/components/Input/SelectBox";
import { clearNotifications, testAction } from "./testActions";
import { ExtraOptions } from "@/app/components/Input/schema";

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
    </>
  );
};

export default Test;
