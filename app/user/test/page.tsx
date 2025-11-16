import FormsLoading from "@/app/pages/Forms/FormsLoading";
import { IoDocumentTextOutline } from "react-icons/io5";

const Test = () => {
  return (
    <div className="tabs tabs-lift h-full min-h-0">
      <label className="tab gap-2">
        <input type="radio" name="test" className="tab " defaultChecked />
        <IoDocumentTextOutline />
        Appointment Form
      </label>
      <div className="tab-content bg-base-200 border-base-300 p-0 shadow-br h-full min-h-0">
        <div className="flex flex-col h-full">
          <FormsLoading />
        </div>
      </div>
    </div>
  );
};

export default Test;
