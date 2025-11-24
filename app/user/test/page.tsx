import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import { TimePeriod } from "@/app/components/Input/Date/utils";
import TermsAndConditions from "@/app/components/Input/TermsAndConditions";
import { clearNotifications, testAction } from "./testActions";

const Test = async () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <button className="btn" onClick={testAction}>
        Test Action
      </button>
      <button className="btn" onClick={clearNotifications}>
        Delete Action
      </button>
      <TermsAndConditions />
      <DateTimeSelector
        name="startTime"
        horizontal
        minDate="now"
        defaultValue={new Date()}
        minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
        maxTime={{ hour: 7, minute: 0, period: TimePeriod.PM }}
      />
    </div>
  );
};

export default Test;
