"use client";
import { motion } from "motion/react";
import { useState } from "react";
import TermsAndConditions from "../Input/TermsAndConditions";
import EditableFormHeader from "./EditableFormHeader";
import EditableFormComponent from "./EditableInput/EditableFormComponent";
import EditableHeader from "./EditableInput/EditableHeader";
import { createFormComponent } from "./EditableInput/utils";
import FormBG from "./FormBG";
import { FormComponent, FormComponentType } from "./FormBuilder.types";
import FormComponentBG from "./FormComponentBG";
import { FormsHeaderProps } from "./FormsHeader";

export type BuiltFormData = {
  header: FormsHeaderProps;
  components: FormComponent[];
  termsAndConditions?: boolean;
};

export type BuiltFormDataWithAnswers = {
  questions: BuiltFormData;
  answers: { [key: string]: any };
};

const EditableFormBuilder = ({
  form,
  requiredComponents,
  onChange,
  onSave,
}: {
  form: BuiltFormData;
  onChange?: (form: BuiltFormData) => void;
  requiredComponents?: string[];
  onSave?: () => void;
}) => {
  const [selectedComponent, setSelectedComponent] = useState<
    string | undefined
  >(undefined);
  const selectedIndex = form.components.findIndex(
    (q) => q.props.name === selectedComponent
  );

  function handleAddComponent(type: FormComponentType) {
    const newQuestion = createFormComponent({
      type,
    });

    // Header selected → add at top
    if (selectedIndex === -1) {
      onChange?.({
        ...form,
        components: [newQuestion, ...form.components],
      });
      return;
    }

    // Otherwise insert after selected component
    const updated = [...form.components];
    updated.splice(selectedIndex + 1, 0, newQuestion);
    onChange?.({ ...form, components: updated });

    setTimeout(() => {
      setSelectedComponent(newQuestion.props.name);
    }, 0);
  }

  function handleMoveComponentUp() {
    if (selectedIndex <= 0) return;
    const updated = [...form.components];
    [updated[selectedIndex - 1], updated[selectedIndex]] = [
      updated[selectedIndex],
      updated[selectedIndex - 1],
    ];
    onChange?.({ ...form, components: updated });
  }

  function handleMoveComponentDown() {
    if (selectedIndex === -1 || selectedIndex >= form.components.length - 1)
      return;
    const updated = [...form.components];
    [updated[selectedIndex + 1], updated[selectedIndex]] = [
      updated[selectedIndex],
      updated[selectedIndex + 1],
    ];
    onChange?.({ ...form, components: updated });
  }

  return (
    <>
      <EditableFormHeader
        onSave={() => onSave?.()}
        selectedComponent={selectedComponent}
        changeTerms={(value) =>
          onChange?.({ ...form, termsAndConditions: value })
        }
        termsAndConditions={form.termsAndConditions}
        isHeader={selectedComponent === form.header.name}
        onAdd={() => handleAddComponent(FormComponentType.TEXT)}
        onAddSeparator={() => handleAddComponent(FormComponentType.SEPARATOR)}
        onMoveUp={handleMoveComponentUp}
        onMoveDown={handleMoveComponentDown}
      />

      <FormBG>
        <div className="relative">
          <motion.div layout>
            <EditableHeader
              selected={selectedComponent === form.header.name}
              onClick={(name) => setSelectedComponent(name)}
              component={form.header}
              onChange={(component) => {
                onChange?.({ ...form, header: component });
              }}
              onAdd={() => handleAddComponent(FormComponentType.TEXT)}
              onAddSeparator={() =>
                handleAddComponent(FormComponentType.SEPARATOR)
              }
            />
          </motion.div>
        </div>
        {form.components.map((component, index) => {
          return (
            <div key={component.props.name} className="relative">
              <motion.div layout>
                <EditableFormComponent
                  requiredComponent={requiredComponents?.includes(
                    component.props.name
                  )}
                  component={component}
                  selected={selectedComponent === component.props.name}
                  onClick={setSelectedComponent}
                  onChange={(updatedComponent) => {
                    const updatedQuestions = [...form.components];
                    updatedQuestions[index] = updatedComponent;
                    onChange?.({ ...form, components: updatedQuestions });
                  }}
                  onDelete={() => {
                    const updatedQuestions = [...form.components];
                    updatedQuestions.splice(index, 1);
                    onChange?.({ ...form, components: updatedQuestions });

                    setTimeout(() => {
                      const componentAbove = updatedQuestions[index - 1];
                      setSelectedComponent(componentAbove?.props.name);
                    }, 0);
                  }}
                  onDuplicate={() => {
                    const updatedQuestions = [...form.components];

                    const newComponent = {
                      ...component,
                      props: {
                        ...component.props,
                        name: crypto.randomUUID(),
                      },
                    };

                    // @ts-expect-error TypeScript cannot infer this type correctly
                    updatedQuestions.splice(index + 1, 0, newComponent);
                    onChange?.({ ...form, components: updatedQuestions });

                    setTimeout(() => {
                      setSelectedComponent(newComponent.props.name);
                    }, 0);
                  }}
                  onAdd={() => handleAddComponent(FormComponentType.TEXT)}
                  onAddSeparator={() =>
                    handleAddComponent(FormComponentType.SEPARATOR)
                  }
                  onMoveUp={handleMoveComponentUp}
                  onMoveDown={handleMoveComponentDown}
                />
              </motion.div>
            </div>
          );
        })}

        {form.termsAndConditions && (
          <motion.div layout>
            <FormComponentBG className="py-5">
              <TermsAndConditions />
            </FormComponentBG>
          </motion.div>
        )}
      </FormBG>
    </>
  );
};

export default EditableFormBuilder;
