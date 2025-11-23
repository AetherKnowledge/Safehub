import { z } from "zod";

export enum Department {
  CITHM = "cithm",
  CBEA = "cbea",
  CAMP = "camp",
  CASE = "case",
  CITE = "cite",
  COM = "com",
}

export enum Program {
  BSHM = "bshm",
  BSTM = "bstm",
  BSA = "bsa",
  BSBA = "bsba",
  BSN = "bsn",
  BSRT = "bsrt",
  BSMLT = "bsmlt",
  CAREGIVING_NC_II = "caregiving-nc-ii",
  BSED = "bsed",
  BECED = "beced",
  BSSW = "bssw",
  ABCA = "abca",
  ABPSY = "abpsy",
  BSIT = "bsit",
  BSCPE = "bscpe",
  BSIE = "bsie",
  DOM = "dom",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export enum Section {
  A = "A",
  B = "B",
  C = "C",
}

export enum GuardianRelationship {
  PARENTS = "parents",
  SIBLING = "sibling",
  GUARDIAN = "guardian",
  OTHER = "other",
}

export const onboardingSchema = z.object({
  // Student details
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),

  // birth date - accept string or Date, coerce to Date
  birthDate: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date)
      return new Date(arg as any);
    return undefined;
  }, z.date()),

  // department & program
  department: z.enum(Department),
  program: z.enum(Program),

  // year & section
  year: z
    .string()
    .transform((val) => Number(val))
    .pipe(
      z
        .number()
        .min(1, "Year must be at least 1")
        .max(4, "Year must be at most 4")
    ),
  section: z.enum(Section),

  // gender
  gender: z.enum(Gender),

  // contact
  contact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number must be at most 15 digits"),

  // Guardian details
  guardianFirstName: z.string().min(1, "Guardian first name is required"),
  guardianMiddleName: z.string().optional(),
  guardianLastName: z.string().min(1, "Guardian last name is required"),
  guardianSuffix: z.string().optional(),

  guardianContact: z
    .string()
    .min(10, "Guardian contact must be at least 10 digits")
    .max(15, "Guardian contact must be at most 15 digits"),

  guardianRelationship: z.enum(GuardianRelationship),

  guardianEmail: z
    .email("Invalid guardian email address")
    .optional()
    .or(z.literal("")),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
