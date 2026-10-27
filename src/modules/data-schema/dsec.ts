import z from "zod";

export const dsecSchema = z.string()

export const labelDsecSchema = z.object({
  dsec: dsecSchema
}).partial()