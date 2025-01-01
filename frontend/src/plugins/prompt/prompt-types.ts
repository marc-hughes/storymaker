import { ConditionSchema, MediaSchema } from "../../types/story-maker";
import { z } from "zod";

export const ConditionalPromptsSchema = z.object({
    id: z.string(),
    body: z.string(),
    conditions: z.array(ConditionSchema),
    media: z.array(MediaSchema),
});

export const PromptPluginDataSchema = z.object({
    prompts: z.array(ConditionalPromptsSchema).default([]),
}).default({}) ;

export type ConditionalPrompt = z.infer<typeof ConditionalPromptsSchema>;

export type PromptPluginData = z.infer<typeof PromptPluginDataSchema>;