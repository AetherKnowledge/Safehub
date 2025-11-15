import { QuestionBox, QuestionType } from "@/app/components/Forms/FormBuilder";
import { TimePeriod } from "@/app/components/Input/Date/utils";

export const bookingQuestions: QuestionBox[] = [
  {
    questionType: QuestionType.TEXTAREA,
    props: {
      name: "focus",
      legend: "What brings you in today, and what would you like to focus on?",
      placeholder: "Type your response here...",
      required: true,
    },
    version: "1",
  },
  {
    questionType: QuestionType.RADIO,
    props: {
      name: "hadCounselingBefore",
      required: true,
      legend:
        "Have you attended counseling before, or would this be your first time?",
      options: [
        { value: "firstTime", label: "This is my first time" },
        { value: "hasAttended", label: "I have attended before" },
      ],
    },
    version: "1",
  },
  {
    questionType: QuestionType.RADIO,
    props: {
      name: "sessionPreference",
      required: true,
      legend: "Do you prefer in-person sessions, online sessions, or either?",
      options: [
        { value: "InPerson", label: "In-person sessions" },
        { value: "Online", label: "Online sessions" },
        { value: "Either", label: "Either" },
      ],
    },
    version: "1",
  },
  {
    questionType: QuestionType.RADIO,
    props: {
      name: "urgencyLevel",
      legend:
        "How urgent is your concern? From 1 to 5, 5 is the highest urgency.",
      required: true,
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
      ],
    },
    version: "1",
  },
  {
    questionType: QuestionType.DATETIME,
    props: {
      name: "startTime",
      legend: "Pick Schedule.",
      minTime: { hour: 8, minute: 0, period: TimePeriod.AM },
      maxTime: { hour: 8, minute: 0, period: TimePeriod.PM },
      required: true,
    },
    version: "1",
  },
  {
    questionType: QuestionType.TEXTAREA,
    props: {
      name: "notes",
      legend: "Any additional notes or comments?",
      placeholder: "Type your response here...",
    },
    version: "1",
  },
];
