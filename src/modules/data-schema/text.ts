import z from "zod";

export const labelTextSchema = z.object({
  insert: z.string(),
  attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional()
}).array().optional()

export type LabelText = z.output<typeof labelTextSchema>