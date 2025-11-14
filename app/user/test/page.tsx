import FormBG from "@/app/components/Forms/FormBG";
import QuestionBG from "@/app/components/Forms/QuestionBG";
import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import { TimePeriod } from "@/app/components/Input/Date/utils";

const Test = async () => {
  async function onSubmit(formData: FormData) {
    "use server";
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data Submitted:", data);
  }

  return (
    <FormBG onSubmit={onSubmit}>
      <QuestionBG>
        <DateTimeSelector
          name="dateTime"
          legend="Pick Date and Time"
          minDate="now"
          minTime={{ hour: 12, minute: 1, period: TimePeriod.AM }}
          maxTime={{ hour: 9, minute: 0, period: TimePeriod.PM }}
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </QuestionBG>
    </FormBG>
  );
};

export default Test;
