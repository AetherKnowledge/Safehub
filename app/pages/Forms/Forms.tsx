import { FormType } from "@/app/generated/prisma";
import FormsTab from "./FormsTab";

const Forms = () => {
  return (
    <div className="tabs tabs-lift h-full min-h-0">
      <FormsTab
        title="Appointment Form"
        formType={FormType.BOOKING}
        groupName="forms-tabs"
        defaultChecked={true}
      />
      <FormsTab
        title="Evaluation Form"
        formType={FormType.EVALUATION}
        groupName="forms-tabs"
        defaultChecked={false}
      />
      {/* <FormsTab
        title="Cancelation Form"
        formType={FormType.CANCELATION}
        groupName="forms-tabs"
        defaultChecked={false}
      /> */}
    </div>
  );
};

export default Forms;
