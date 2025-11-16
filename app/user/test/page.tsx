"use client";
import EditableFormComponent from "@/app/components/Forms/EditableInput/EditableFormComponent";
import EditableHeader from "@/app/components/Forms/EditableInput/EditableHeader";
import { createFormComponent } from "@/app/components/Forms/EditableInput/utils";
import FormBG from "@/app/components/Forms/FormBG";
import {
  FormComponent,
  FormComponentType,
} from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { bookingQuestions } from "@/app/pages/Appointment/Question";
import { motion } from "motion/react";
import { useState } from "react";

const Test = () => {
  const [questions, setQuestions] = useState<FormComponent[]>(bookingQuestions);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );
  const [header, setHeader] = useState<FormsHeaderProps>({
    name: "header",
    title: "Test Question",
    description: "This is a test description.",
  });

  return (
    <FormBG>
      <div className="relative">
        <motion.div layout>
          <EditableHeader
            selected={selectedComponent === header.name}
            onClick={(name) => setSelectedComponent(name)}
            component={header}
            onChange={(component) => {
              setHeader(component);
            }}
            onAdd={() => {
              const newQuestion = createFormComponent({
                type: FormComponentType.TEXT,
              });
              setQuestions([newQuestion, ...questions]);
            }}
            onAddSeparator={() => {
              const newQuestion = createFormComponent({
                type: FormComponentType.SEPARATOR,
              });
              setQuestions([newQuestion, ...questions]);
            }}
          />
        </motion.div>
      </div>
      {questions.map((component, index) => {
        return (
          <div key={component.props.name} className="relative">
            <motion.div layout>
              <EditableFormComponent
                defaultValue={component}
                selected={selectedComponent === component.props.name}
                onClick={setSelectedComponent}
                onChange={(updatedComponent) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index] = updatedComponent;
                  setQuestions(updatedQuestions);
                }}
                onDelete={() => {
                  const updatedQuestions = [...questions];
                  updatedQuestions.splice(index, 1);
                  setQuestions(updatedQuestions);
                }}
                onDuplicate={() => {
                  const updatedQuestions = [...questions];

                  const newComponent = {
                    ...component,
                    props: {
                      ...component.props,
                      name: crypto.randomUUID(),
                    },
                  };

                  // @ts-expect-error TypeScript cannot infer this type correctly
                  updatedQuestions.splice(index + 1, 0, newComponent);
                  setQuestions(updatedQuestions);
                }}
                onAdd={() => {
                  const newQuestion = createFormComponent({
                    type: FormComponentType.TEXT,
                  });
                  const updatedQuestions = [...questions];
                  updatedQuestions.splice(index + 1, 0, newQuestion);
                  setQuestions(updatedQuestions);
                }}
                onAddSeparator={() => {
                  const newQuestion = createFormComponent({
                    type: FormComponentType.SEPARATOR,
                  });
                  const updatedQuestions = [...questions];
                  updatedQuestions.splice(index + 1, 0, newQuestion);
                  setQuestions(updatedQuestions);
                }}
                onMoveUp={() => {
                  if (index === 0) return;
                  const updatedQuestions = [...questions];
                  const temp = updatedQuestions[index - 1];
                  updatedQuestions[index - 1] = updatedQuestions[index];
                  updatedQuestions[index] = temp;
                  setQuestions(updatedQuestions);
                }}
                onMoveDown={() => {
                  if (index === questions.length - 1) return;
                  const updatedQuestions = [...questions];
                  const temp = updatedQuestions[index + 1];
                  updatedQuestions[index + 1] = updatedQuestions[index];
                  updatedQuestions[index] = temp;
                  setQuestions(updatedQuestions);
                }}
              />
            </motion.div>
          </div>
        );
      })}

      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </FormBG>
  );
};

export default Test;
