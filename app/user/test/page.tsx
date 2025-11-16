"use client";
import EditableFormComponent from "@/app/components/Forms/EditableInput/EditableFormComponent";
import FormBG from "@/app/components/Forms/FormBG";
import { FormComponentType } from "@/app/components/Forms/FormBuilder";
import FormComponentBG from "@/app/components/Forms/FormComponentBG";
import SelectBox from "@/app/components/Input/SelectBox";
import { useState } from "react";

const Test = () => {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  return (
    <>
      <FormBG>
        <EditableFormComponent
          defaultValue={{
            type: FormComponentType.TEXT,
            props: { name: "name", legend: "Test Question" },
            version: "1",
          }}
          selected={selectedComponent === "name"}
          onClick={(id: string) => setSelectedComponent(id)}
        />
        <EditableFormComponent
          defaultValue={{
            type: FormComponentType.TEXT,
            props: { name: "name2", legend: "Test Question 2" },
            version: "1",
          }}
          selected={selectedComponent === "name2"}
          onClick={(id: string) => setSelectedComponent(id)}
        />
        <FormComponentBG>
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
        </FormComponentBG>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </FormBG>
    </>
  );
};

export default Test;
