import { labelContentSchema } from "@/modules/data-schema/content"
import { labelDsecSchema } from "@/modules/data-schema/dsec"
import { labelStyleSchema } from "@/modules/data-schema/style"
import z from "zod"

export const labelCompositionSchema = labelStyleSchema.and(labelContentSchema).and(labelDsecSchema)

export const labelDirectoryEntrySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  tags: z.record(z.string(), z.string()).meta({
    description: "For sorting and grouping."
  }),
  composition: (z.string().or(labelCompositionSchema)).array().meta({
    description: "Either a string that is the key of the 'partials' entry, which in turn defines a label composition or a label composition object directly. When displaying these entries are meant to be assigned with the elements coming later in the array overwriting the ones before them. Example: ['base', 'group:abc'] firstly assigns partials['base'], then partials['group:abc'] to the label composition. The assignment is a deep assignment meaning that only values that are not objects are assigned."
  }),
})

export const labelDirectorySchema = z.object({
  $schema: z.literal("label-directory.schema.json"),
  partials: z.record(z.string(), labelCompositionSchema).meta({
    description: "Define partial label compositions to be reused later."
  }),
  labels: labelDirectoryEntrySchema.array().meta({
    description: "All labels. Every entry is a single label."
  })
})

export type LabelComposition = z.output<typeof labelCompositionSchema>
export type LabelDirectory = z.output<typeof labelDirectorySchema>
export type LabelDirectoryEntry = z.output<typeof labelDirectoryEntrySchema>

