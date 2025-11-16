"use client";
import EditableQuestionBox from "@/app/components/Forms/EditableInput/EditableQuestionBox";
import FormBG from "@/app/components/Forms/FormBG";
import { QuestionType } from "@/app/components/Forms/FormBuilder";
import QuestionBG from "@/app/components/Forms/QuestionBG";
import SelectBox from "@/app/components/Input/SelectBox";
import { useState } from "react";

const Test = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  return (
    <>
      <FormBG>
        <EditableQuestionBox
          questionBox={{
            questionType: QuestionType.TEXT,
            props: { name: "name", legend: "Test Question" },
            version: "1",
          }}
          selected={selectedQuestion === "name"}
          onClick={(id: string) => setSelectedQuestion(id)}
        />
        <EditableQuestionBox
          questionBox={{
            questionType: QuestionType.TEXT,
            props: { name: "name2", legend: "Test Question 2" },
            version: "1",
          }}
          selected={selectedQuestion === "name2"}
          onClick={(id: string) => setSelectedQuestion(id)}
        />
        <QuestionBG>
          <SelectBox
            name="test-select"
            legend="Test Select Box"
            placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure vero temporibus ut quidem, delectus, veniam saepe dolorum illo amet animi nesciunt qui quibusdam voluptatibus at adipisci, similique distinctio magnam nemo!"
            options={[
              {
                label:
                  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure vero temporibus ut quidem, delectus, veniam saepe dolorum illo amet animi nesciunt qui quibusdam voluptatibus at adipisci, similique distinctio magnam nemo!",
                value: "option1",
              },
              { label: "Option 2", value: "option2" },
              { label: "Option 3", value: "option3" },
            ]}
            required
          />
        </QuestionBG>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </FormBG>
    </>
  );
};

export default Test;
