import { FormType } from "@/app/generated/prisma";
import z from "zod";

export const formTypeSchema = z.enum(FormType);
