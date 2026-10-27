import { labelTextSchema } from "@/modules/data-schema/text";
import z from "zod";

export const labelLayoutSchema = z.enum(['small', 'large', 'add-on', 'line'])

export const labelContentSchema = z.object({
  layout: labelLayoutSchema,
  text: z.object({
    title: labelTextSchema,
    content: labelTextSchema,
  }).partial()
}).partial()

export type LabelContent = z.output<typeof labelContentSchema>
export type LabelLayout = z.output<typeof labelLayoutSchema>