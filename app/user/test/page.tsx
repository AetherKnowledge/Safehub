import FormsBuilder, {
  QuestionBox,
  QuestionType,
} from "@/app/components/Forms/FormBuilder";
import { FormsHeaderProps } from "@/app/components/Forms/FormsHeader";
import { SeparatorProps } from "@/app/components/Forms/Separator";
import { DatePickerSelectorProps } from "@/app/components/Input/Date/DatePickerSelector";
import {
  HorizontalBoxItem,
  HorizontalItemsBoxProps,
} from "@/app/components/Input/HorizontalItemsBox";
import { RadioBoxProps } from "@/app/components/Input/RadioBox";
import { SelectBoxProps } from "@/app/components/Input/SelectBox";

const Test = async () => {
  async function onSubmit(formData: FormData) {
    "use server";
    const data = Object.fromEntries(formData.entries());
    console.log("Form Data Submitted:", data);
  }
  const header: FormsHeaderProps = {
    title: "Registration Form",
    description:
      "Answer the registration form truthfully to complete the initial account setup.",
  };

  const studentQuestions: QuestionBox[] = [
    {
      questionType: QuestionType.SEPARATOR,
      props: {
        name: "user-details",
        text: "User Details",
      } as SeparatorProps,
      version: "1",
    } as QuestionBox,
    {
      questionType: QuestionType.HORIZONTAL_ITEMS,
      props: {
        name: "student-full-name",
        legend: "What is your full name?",
        items: [
          {
            type: QuestionType.TEXT,
            props: {
              name: "student-first-name",
              placeholder: "First Name",
              required: true,
            },
          } as HorizontalBoxItem,
          {
            type: QuestionType.TEXT,
            props: {
              name: "student-middle-name",
              placeholder: "Middle Name",
            },
          } as HorizontalBoxItem,
          {
            type: QuestionType.TEXT,
            props: {
              name: "student-last-name",
              placeholder: "Last Name",
              required: true,
            },
          } as HorizontalBoxItem,
          {
            type: QuestionType.TEXT,
            props: {
              name: "student-suffix",
              placeholder: "Suffix",
            },
          } as HorizontalBoxItem,
        ],
      } as HorizontalItemsBoxProps,
      version: "1",
    },
    {
      questionType: QuestionType.DATE,
      props: {
        name: "student-birth-date",
        legend: "What is your birth date?",
        required: true,
      } as DatePickerSelectorProps,
      version: "1",
    },
    {
      questionType: QuestionType.LINKED_SELECTOR,
      props: {
        name: "department-and-program",
        horizontal: true,
        legend: "What is your department and program?",
        required: true,
        parent: {
          type: QuestionType.SELECT,
          props: {
            name: "student-department",
            required: true,
          } as SelectBoxProps,
        },
        child: {
          type: QuestionType.SELECT,
          props: {
            name: "student-program",
            required: true,
          } as SelectBoxProps,
        },
        linkedOptions: [
          {
            parentOption: {
              label:
                "College of International Tourism and Hospitality Management (CITHM)",
              value: "cithm",
            },
            childOptions: [
              { label: "BS Hospitality Management (BHM)", value: "bshm" },
              { label: "BS Tourism Management (BTM)", value: "bstm" },
            ],
          },
          {
            parentOption: {
              label:
                "College of Business, Entrepreneurship and Accountancy (CBEA)",
              value: "cbea",
            },
            childOptions: [
              { label: "BS Accountancy (BSA)", value: "bsa" },
              { label: "BS Business Administration (BSBA)", value: "bsba" },
            ],
          },
          {
            parentOption: {
              label: "College of Allied Medical Professions (CAMP)",
              value: "camp",
            },
            childOptions: [
              { label: "BS Nursing (BSN)", value: "bsn" },
              { label: "BS Radiologic Technology (BSRT)", value: "bsrt" },
              { label: "BS Medical Technology (BSMLT)", value: "bsmlt" },
              { label: "Caregiving NC II", value: "caregiving-nc-ii" },
            ],
          },
          {
            parentOption: {
              label: "College of Arts, Sciences and Education (CASE)",
              value: "case",
            },
            childOptions: [
              {
                label: "Bachelor of Secondary Education (BSEd)",
                value: "bsed",
              },
              {
                label: "Bachelor of Early Childhood Education (BECEd)",
                value: "beced",
              },
              { label: "BS Social Work (BSSW)", value: "bssw" },
              { label: "AB Communication Arts (ABCA)", value: "abca" },
              { label: "AB Psychology (ABPsy)", value: "abpsy" },
            ],
          },
          {
            parentOption: {
              label: "College of Information Technology and Engineering (CITE)",
              value: "cite",
            },
            childOptions: [
              { label: "BS Information Technology (BSIT)", value: "bsit" },
              { label: "BS Computer Engineering (BSCpE)", value: "bscpe" },
              { label: "BS Industrial Engineering (BSIE)", value: "bsie" },
            ],
          },
          {
            parentOption: {
              label: "College of Medicine",
              value: "com",
            },
            childOptions: [{ label: "Doctor of Medicine", value: "dom" }],
          },
        ],
      },
      version: "1",
    },
    {
      questionType: QuestionType.HORIZONTAL_ITEMS,
      props: {
        name: "year-and-section",
        legend: "What is your year and section?",
        items: [
          {
            type: QuestionType.SELECT,
            props: {
              name: "student-year",
              options: [
                { label: "1st Year", value: "1" },
                { label: "2nd Year", value: "2" },
                { label: "3rd Year", value: "3" },
                { label: "4th Year", value: "4" },
              ],
              required: true,
            } as SelectBoxProps,
          },
          {
            type: QuestionType.SELECT,
            props: {
              name: "student-section",
              options: [
                { label: "A", value: "A" },
                { label: "B", value: "B" },
                { label: "C", value: "C" },
              ],
              required: true,
            } as SelectBoxProps,
          },
        ],
      } as HorizontalItemsBoxProps,
      version: "1",
    },
    {
      questionType: QuestionType.RADIO,
      props: {
        name: "student-gender",
        legend: "What is your gender?",
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ],
        required: true,
      } as RadioBoxProps,
      version: "1",
    },
    {
      questionType: QuestionType.TEXT,
      props: {
        name: "student-contact",
        legend: "What is your contact number?",
        placeholder: "Contact number",
        type: "tel",
        required: true,
      },
      version: "1",
    },
  ];

  const guardianQuestions: QuestionBox[] = [
    {
      questionType: QuestionType.SEPARATOR,
      props: {
        name: "guardian-details",
        text: "Guardian Details",
      } as SeparatorProps,
      version: "1",
    },
    {
      questionType: QuestionType.HORIZONTAL_ITEMS,
      props: {
        name: "guardian-full-name",
        legend: "What is your guardians full name?",
        items: [
          {
            type: QuestionType.TEXT,
            props: {
              name: "guardian-first-name",
              placeholder: "First Name",
              required: true,
            },
          } as HorizontalBoxItem,
          {
            type: QuestionType.TEXT,
            props: {
              name: "guardian-middle-name",
              placeholder: "Middle Name",
            },
          } as HorizontalBoxItem,
          {
            type: QuestionType.TEXT,
            props: {
              name: "guardian-last-name",
              placeholder: "Last Name",
              required: true,
            },
          } as HorizontalBoxItem,
          {
            type: QuestionType.TEXT,
            props: {
              name: "guardian-suffix",
              placeholder: "Suffix",
            },
          } as HorizontalBoxItem,
        ],
      } as HorizontalItemsBoxProps,
      version: "1",
    },
    {
      questionType: QuestionType.TEXT,
      props: {
        name: "guardian-contact",
        legend: "What is your guardian's contact number?",
        placeholder: "Contact number",
        type: "tel",
        required: true,
      },
      version: "1",
    },
    {
      questionType: QuestionType.RADIO,
      props: {
        name: "guardian-relationship",
        legend: "What is your relationship to the guardian?",
        options: [
          { label: "Parents", value: "parents" },
          { label: "Sibling", value: "sibling" },
          { label: "Legal Guardian", value: "guardian" },
          { label: "Other", value: "other" },
        ],
        required: true,
      } as SelectBoxProps,
      version: "1",
    },
    {
      questionType: QuestionType.TEXT,
      props: {
        name: "guardian-email",
        legend: "What is your guardian's email address?",
        placeholder: "Email address",
        type: "email",
        required: true,
      },
      version: "1",
    },
  ];

  const question: QuestionBox[] = [...studentQuestions, ...guardianQuestions];

  return (
    <FormsBuilder
      header={header}
      questions={question}
      hasTermsAndConditions
      onSubmit={onSubmit}
    />
  );
};

export default Test;
