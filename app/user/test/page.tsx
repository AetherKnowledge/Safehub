import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import { TimePeriod } from "@/app/components/Input/Date/utils";
import { ExtraOptions } from "@/app/components/Input/schema";
import SelectBox from "@/app/components/Input/SelectBox";
import TermsAndConditions from "@/app/components/Input/TermsAndConditions";
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
      <TermsAndConditions readOnly />
      <DateTimeSelector
        name="startTime"
        horizontal
        minDate="now"
        minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
        maxTime={{ hour: 7, minute: 0, period: TimePeriod.PM }}
      />
    </>
  );
};

export default Test;
