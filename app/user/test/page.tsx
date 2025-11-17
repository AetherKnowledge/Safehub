import DateSelector from "@/app/components/Input/Date/DateSelector";
import DateTimeSelector from "@/app/components/Input/Date/DateTimeSelector";
import TimeSelector from "@/app/components/Input/Date/TimeSelector";
import LinearScale from "@/app/components/Input/LinearScale";
import RadioBox from "@/app/components/Input/RadioBox";
import SelectBox from "@/app/components/Input/SelectBox";
import TextArea from "@/app/components/Input/TextArea";
import TextBox from "@/app/components/Input/TextBox";

const Test = () => {
  const options = [
    { label: "option1", value: "option1" },
    { label: "option2", value: "option2" },
  ];

  return (
    <div className="flex flex-col min-h-0 h-full">
      <LinearScale name="test" readonly />
      <TextBox name="test2" readonly />
      <TextArea name="test3" readonly />
      <TimeSelector name="test4" readonly />
      <DateSelector name="test5" readonly />
      <DateTimeSelector name="test6" readonly />
      <SelectBox
        name="test7"
        options={options}
        readonly
        defaultValue="option1"
      />
      <RadioBox
        name="test8"
        options={options}
        defaultValue="option1"
        readonly
      />
    </div>
  );
};

export default Test;
