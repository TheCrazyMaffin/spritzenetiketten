import { z } from "zod"

export const colorSchema = z.string().nullable()

export const fillSchema = z.object({
  solid: colorSchema,
  topHalf: colorSchema,
  bottomHalf: colorSchema,
  bottomLeftHalf: colorSchema,
  topRightHalf: colorSchema,
  hatch135deg: colorSchema,
}).partial()

export const sidesSchema = z.object({
  top: z.boolean(),
  right: z.boolean(),
  bottom: z.boolean(),
  left: z.boolean(),
}).partial()

export const labelStyleSchema = z.object({
  aspectRatio: z.number(),
  backgroundFill: fillSchema,
  textBackgroundFill: fillSchema,
  borderFill: fillSchema,
  borderSides: sidesSchema,
  borderSize: z.number(),
  roundedEdges: z.number(),
  midline: colorSchema,
}).partial()

export type LabelStyle = z.output<typeof labelStyleSchema>
export type LabelFillStyle = z.output<typeof fillSchema>
export type LabelSides = z.output<typeof sidesSchema>