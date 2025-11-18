"use client";
import { motion } from "motion/react";
import { useState } from "react";
import TermsAndConditions from "../Input/TermsAndConditions";
import EditableFormHeader from "./EditableFormHeader";
import EditableFormComponent from "./EditableInput/EditableFormComponent";
import EditableHeader from "./EditableInput/EditableHeader";
import { createFormComponent } from "./EditableInput/utils";
import FormBG from "./FormBG";
import { FormComponent, FormComponentType } from "./FormBuilder";
import FormComponentBG from "./FormComponentBG";
import { FormsHeaderProps } from "./FormsHeader";

export type BuiltFormData = {
  header: FormsHeaderProps;
  components: FormComponent[];
  termsAndConditions?: boolean;
};

const EditableFormBuilder = ({
  form,
  onChange,
  onSave,
}: {
  form: BuiltFormData;
  onChange?: (form: BuiltFormData) => void;
  onSave?: () => void;
}) => {
  const [selectedComponent, setSelectedComponent] = useState<
    string | undefined
  >(undefined);
  const selectedIndex = form.components.findIndex(
    (q) => q.props.name === selectedComponent
  );

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
        onAdd={() => {
          const newQuestion = createFormComponent({
            type: FormComponentType.TEXT,
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
        }}
        onAddSeparator={() => {
          const newQuestion = createFormComponent({
            type: FormComponentType.SEPARATOR,
          });

          if (selectedIndex === -1) {
            onChange?.({
              ...form,
              components: [newQuestion, ...form.components],
            });
            return;
          }

          const updated = [...form.components];
          updated.splice(selectedIndex + 1, 0, newQuestion);
          onChange?.({ ...form, components: updated });
        }}
        onMoveUp={() => {
          if (selectedIndex <= 0) return;
          const updated = [...form.components];
          [updated[selectedIndex - 1], updated[selectedIndex]] = [
            updated[selectedIndex],
            updated[selectedIndex - 1],
          ];
          onChange?.({ ...form, components: updated });
        }}
        onMoveDown={() => {
          if (
            selectedIndex === -1 ||
            selectedIndex >= form.components.length - 1
          )
            return;
          const updated = [...form.components];
          [updated[selectedIndex + 1], updated[selectedIndex]] = [
            updated[selectedIndex],
            updated[selectedIndex + 1],
          ];
          onChange?.({ ...form, components: updated });
        }}
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
              onAdd={() => {
                const newQuestion = createFormComponent({
                  type: FormComponentType.TEXT,
                });
                onChange?.({
                  ...form,
                  components: [newQuestion, ...form.components],
                });
              }}
              onAddSeparator={() => {
                const newQuestion = createFormComponent({
                  type: FormComponentType.SEPARATOR,
                });
                onChange?.({
                  ...form,
                  components: [newQuestion, ...form.components],
                });
              }}
            />
          </motion.div>
        </div>
        {form.components.map((component, index) => {
          return (
            <div key={component.props.name} className="relative">
              <motion.div layout>
                <EditableFormComponent
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
                  }}
                  onAdd={() => {
                    const newQuestion = createFormComponent({
                      type: FormComponentType.TEXT,
                    });
                    const updatedQuestions = [...form.components];
                    updatedQuestions.splice(index + 1, 0, newQuestion);
                    onChange?.({ ...form, components: updatedQuestions });
                  }}
                  onAddSeparator={() => {
                    const newQuestion = createFormComponent({
                      type: FormComponentType.SEPARATOR,
                    });
                    const updatedQuestions = [...form.components];
                    updatedQuestions.splice(index + 1, 0, newQuestion);
                    onChange?.({ ...form, components: updatedQuestions });
                  }}
                  onMoveUp={() => {
                    if (index === 0) return;
                    const updatedQuestions = [...form.components];
                    const temp = updatedQuestions[index - 1];
                    updatedQuestions[index - 1] = updatedQuestions[index];
                    updatedQuestions[index] = temp;
                    onChange?.({ ...form, components: updatedQuestions });
                  }}
                  onMoveDown={() => {
                    if (index === form.components.length - 1) return;
                    const updatedQuestions = [...form.components];
                    const temp = updatedQuestions[index + 1];
                    updatedQuestions[index + 1] = updatedQuestions[index];
                    updatedQuestions[index] = temp;
                    onChange?.({ ...form, components: updatedQuestions });
                  }}
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
