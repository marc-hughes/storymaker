import { z } from "zod";
import { ConditionSchema, MediaSchema } from "../../types/story-maker";

export const ResponseSchema = z.object({
  id: z.string(),
  text: z.string(),
  conditions: z.array(ConditionSchema),
  media: z.array(MediaSchema),
});

export const ResponsePluginDataSchema = z.object({
  responses: z.array(ResponseSchema),
});

export type Response = z.infer<typeof ResponseSchema>;
export type ResponsePluginData = z.infer<typeof ResponsePluginDataSchema>;
