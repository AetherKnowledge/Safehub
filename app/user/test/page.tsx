import { FormComponentType } from "@/app/components/Forms/FormBuilder";
import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import { TimePeriod } from "@/app/components/Input/Date/utils";
import LinkedSelector from "@/app/components/Input/LinkedSelector";
import { ExtraOptions } from "@/app/components/Input/schema";
import SelectBox, { SelectBoxProps } from "@/app/components/Input/SelectBox";
import { departmentsWithPrograms } from "@/app/pages/Onboarding/Questions";
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
      <SelectBox
        name="test"
        options={[]}
        extraOptions={ExtraOptions.COUNSELOR_LIST}
      />
      <div className="flex-1 flex flex-row"></div>
      <LinkedSelector
        name="department-and-program"
        horizontal={true}
        legend="What is your department and program?"
        required={true}
        parent={{
          type: FormComponentType.SELECT,
          props: {
            name: "department",
            required: true,
          } as SelectBoxProps,
        }}
        child={{
          type: FormComponentType.SELECT,
          props: {
            name: "program",
            required: true,
            options: [],
          },
        }}
        linkedOptions={departmentsWithPrograms}
      />
      <DateTimeSelector
        name="startTime"
        horizontal
        minDate="now"
        minTime={{ hour: 8, minute: 0, period: TimePeriod.AM }}
        maxTime={{ hour: 7, minute: 0, period: TimePeriod.PM }}
      />
    </div>
  );
};

export default Test;
