"use client";
import EditableFormComponent from "@/app/components/Forms/EditableInput/EditableFormComponent";
import EditableHeader from "@/app/components/Forms/EditableInput/EditableHeader";
import { FormOptionsBottom } from "@/app/components/Forms/EditableInput/FormsOptions";
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
  const selectedIndex = questions.findIndex(
    (q) => q.props.name === selectedComponent
  );

  return (
    <>
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
      </FormBG>
      <FormOptionsBottom
        isHeader={selectedComponent === header.name}
        onAdd={() => {
          const newQuestion = createFormComponent({
            type: FormComponentType.TEXT,
          });

          // Header selected → add at top
          if (selectedIndex === -1) {
            setQuestions([newQuestion, ...questions]);
            return;
          }

          // Otherwise insert after selected component
          const updated = [...questions];
          updated.splice(selectedIndex + 1, 0, newQuestion);
          setQuestions(updated);
        }}
        onAddSeparator={() => {
          const newQuestion = createFormComponent({
            type: FormComponentType.SEPARATOR,
          });

          if (selectedIndex === -1) {
            setQuestions([newQuestion, ...questions]);
            return;
          }

          const updated = [...questions];
          updated.splice(selectedIndex + 1, 0, newQuestion);
          setQuestions(updated);
        }}
        onMoveUp={() => {
          if (selectedIndex <= 0) return;
          const updated = [...questions];
          [updated[selectedIndex - 1], updated[selectedIndex]] = [
            updated[selectedIndex],
            updated[selectedIndex - 1],
          ];
          setQuestions(updated);
        }}
        onMoveDown={() => {
          if (selectedIndex === -1 || selectedIndex >= questions.length - 1)
            return;
          const updated = [...questions];
          [updated[selectedIndex + 1], updated[selectedIndex]] = [
            updated[selectedIndex],
            updated[selectedIndex + 1],
          ];
          setQuestions(updated);
        }}
      />
    </>
  );
};

export default Test;
