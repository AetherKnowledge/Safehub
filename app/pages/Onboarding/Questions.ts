import {
  FormComponent,
  FormComponentType,
} from "@/app/components/Forms/FormBuilder";
import { HorizontalBoxItem } from "@/app/components/Input/HorizontalItemsBox";
import { Option } from "@/app/components/Input/InputInterface";
import { LinkedOption } from "@/app/components/Input/LinkedSelector";
import { SelectBoxProps } from "@/app/components/Input/SelectBox";
import { Department, Gender, Program, Section } from "./schema";

export const departmentsWithPrograms: LinkedOption[] = [
  {
    parentOption: {
      label:
        "College of International Tourism and Hospitality Management (CITHM)",
      value: Department.CITHM,
    },
    childOptions: [
      { label: "BS Hospitality Management (BHM)", value: Program.BSHM },
      { label: "BS Tourism Management (BTM)", value: Program.BSTM },
    ],
  },
  {
    parentOption: {
      label: "College of Business, Entrepreneurship and Accountancy (CBEA)",
      value: Department.CBEA,
    },
    childOptions: [
      { label: "BS Accountancy (BSA)", value: Program.BSA },
      { label: "BS Business Administration (BSBA)", value: Program.BSBA },
    ],
  },
  {
    parentOption: {
      label: "College of Allied Medical Professions (CAMP)",
      value: Department.CAMP,
    },
    childOptions: [
      { label: "BS Nursing (BSN)", value: Program.BSN },
      { label: "BS Radiologic Technology (BSRT)", value: Program.BSRT },
      { label: "BS Medical Technology (BSMLT)", value: Program.BSMLT },
      { label: "Caregiving NC II", value: Program.CAREGIVING_NC_II },
    ],
  },
  {
    parentOption: {
      label: "College of Arts, Sciences and Education (CASE)",
      value: Department.CASE,
    },
    childOptions: [
      {
        label: "Bachelor of Secondary Education (BSEd)",
        value: Program.BSED,
      },
      {
        label: "Bachelor of Early Childhood Education (BECEd)",
        value: Program.BECED,
      },
      { label: "BS Social Work (BSSW)", value: Program.BSSW },
      { label: "AB Communication Arts (ABCA)", value: Program.ABCA },
      { label: "AB Psychology (ABPsy)", value: Program.ABPSY },
    ],
  },
  {
    parentOption: {
      label: "College of Information Technology and Engineering (CITE)",
      value: Department.CITE,
    },
    childOptions: [
      { label: "BS Information Technology (BSIT)", value: Program.BSIT },
      { label: "BS Computer Engineering (BSCpE)", value: Program.BSCPE },
      { label: "BS Industrial Engineering (BSIE)", value: Program.BSIE },
    ],
  },
  {
    parentOption: {
      label: "College of Medicine",
      value: Department.COM,
    },
    childOptions: [{ label: "Doctor of Medicine", value: Program.DOM }],
  },
];

export const yearOptions: Option[] = [
  { label: "1st Year", value: "1" },
  { label: "2nd Year", value: "2" },
  { label: "3rd Year", value: "3" },
  { label: "4th Year", value: "4" },
];

export const sectionOptions: Option[] = [
  { label: "A", value: Section.A },
  { label: "B", value: Section.B },
  { label: "C", value: Section.C },
];

export const genderOptions: Option[] = [
  { label: "Male", value: Gender.MALE },
  { label: "Female", value: Gender.FEMALE },
  { label: "Other", value: Gender.OTHER },
];

export const studentQuestions: FormComponent[] = [
  {
    type: FormComponentType.SEPARATOR,
    props: {
      name: "user-details",
      legend: "User Details",
    },
    version: "1",
  },
  {
    type: FormComponentType.HORIZONTAL_ITEMS,
    props: {
      name: "fullName",
      legend: "What is your full name?",
      items: [
        {
          type: FormComponentType.TEXT,
          props: {
            name: "firstName",
            placeholder: "First Name",
            required: true,
          },
        } as HorizontalBoxItem,
        {
          type: FormComponentType.TEXT,
          props: {
            name: "middleName",
            placeholder: "Middle Name",
          },
        } as HorizontalBoxItem,
        {
          type: FormComponentType.TEXT,
          props: {
            name: "lastName",
            placeholder: "Last Name",
            required: true,
          },
        } as HorizontalBoxItem,
        {
          type: FormComponentType.TEXT,
          props: {
            name: "suffix",
            placeholder: "Suffix",
          },
        },
      ],
    },
    version: "1",
  },
  {
    type: FormComponentType.DATE,
    props: {
      name: "birthDate",
      legend: "What is your birth date?",
      required: true,
    },
    version: "1",
  },
  {
    type: FormComponentType.LINKED_SELECTOR,
    props: {
      name: "department-and-program",
      horizontal: true,
      legend: "What is your department and program?",
      required: true,
      parent: {
        type: FormComponentType.SELECT,
        props: {
          name: "department",
          required: true,
        } as SelectBoxProps,
      },
      child: {
        type: FormComponentType.SELECT,
        props: {
          name: "program",
          required: true,
          options: [],
        },
      },
      linkedOptions: departmentsWithPrograms,
    },
    version: "1",
  },
  {
    type: FormComponentType.HORIZONTAL_ITEMS,
    props: {
      name: "year-and-section",
      legend: "What is your year and section?",
      items: [
        {
          type: FormComponentType.SELECT,
          props: {
            name: "year",
            options: yearOptions,
            required: true,
          },
        },
        {
          type: FormComponentType.SELECT,
          props: {
            name: "section",
            options: sectionOptions,
            required: true,
          },
        },
      ],
    },
    version: "1",
  },
  {
    type: FormComponentType.RADIO,
    props: {
      name: "gender",
      legend: "What is your gender?",
      options: genderOptions,
      required: true,
    },
    version: "1",
  },
  {
    type: FormComponentType.TEXT,
    props: {
      name: "contact",
      legend: "What is your contact number?",
      placeholder: "Contact number",
      type: "tel",
      required: true,
    },
    version: "1",
  },
];

export const guardianQuestions: FormComponent[] = [
  {
    type: FormComponentType.SEPARATOR,
    props: {
      name: "guardian-details",
      legend: "Guardian Details",
    },
    version: "1",
  },
  {
    type: FormComponentType.HORIZONTAL_ITEMS,
    props: {
      name: "guardian-full-name",
      legend: "What is your guardian's full name?",
      items: [
        {
          type: FormComponentType.TEXT,
          props: {
            name: "guardianFirstName",
            placeholder: "First Name",
            required: true,
          },
        },
        {
          type: FormComponentType.TEXT,
          props: {
            name: "guardianMiddleName",
            placeholder: "Middle Name",
          },
        },
        {
          type: FormComponentType.TEXT,
          props: {
            name: "guardianLastName",
            placeholder: "Last Name",
            required: true,
          },
        },
        {
          type: FormComponentType.TEXT,
          props: {
            name: "guardianSuffix",
            placeholder: "Suffix",
          },
        },
      ],
    },
    version: "1",
  },
  {
    type: FormComponentType.TEXT,
    props: {
      name: "guardianContact",
      legend: "What is your guardian's contact number?",
      placeholder: "Contact number",
      type: "tel",
      required: true,
    },
    version: "1",
  },
  {
    type: FormComponentType.SELECT,
    props: {
      name: "guardianRelationship",
      legend: "What is your relationship to the guardian?",
      options: [
        { label: "Parents", value: "parents" },
        { label: "Sibling", value: "sibling" },
        { label: "Legal Guardian", value: "guardian" },
        { label: "Other", value: "other" },
      ],
      required: true,
    },
    version: "1",
  },
  {
    type: FormComponentType.TEXT,
    props: {
      name: "guardianEmail",
      legend: "What is your guardian's email address?",
      placeholder: "Email address",
      type: "email",
      required: true,
    },
    version: "1",
  },
];
