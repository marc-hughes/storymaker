import { z } from 'zod';

// Helper schemas
const FlagBaseSchema = z.object({
    id: z.string(),
    name: z.string(),
});

const BooleanFlagSchema = FlagBaseSchema.extend({
    type: z.literal('boolean'),
    value: z.boolean(),
    initialValue: z.boolean(),
});

const NumberFlagSchema = FlagBaseSchema.extend({
    type: z.literal('number'),
    value: z.number(),
    initialValue: z.number(),
});

const SelectFlagSchema = FlagBaseSchema.extend({
    type: z.literal('select'),
    value: z.string(),
    initialValue: z.string(),
    options: z.array(z.string()),
});

const FlagSchema: z.ZodType = z.lazy(() =>
    z.union([
        BooleanFlagSchema,
        NumberFlagSchema,
        SelectFlagSchema,
        z.object({
            type: z.literal('and'),
            conditions: z.array(z.lazy(() => ConditionSchema)),
        }),
        z.object({
            type: z.literal('or'),
            conditions: z.array(z.lazy(() => ConditionSchema)),
        }),
    ])
);

const ConditionSchema = z.object({
    flag: FlagSchema,
    type: z.enum(['equals', 'not_equals', 'greater_than', 'less_than', 'greater_than_or_equal_to', 'less_than_or_equal_to']),
    targetValue: z.union([z.string(), z.number(), z.boolean()]),
});

const BaseActionSchema = z.object({
    id: z.string(),
});

const SetFlagActionSchema = BaseActionSchema.extend({
    type: z.literal('set_flag'),
    flag: FlagSchema,
    value: z.union([z.string(), z.number(), z.boolean()]),
});

const EndStoryActionSchema = BaseActionSchema.extend({
    type: z.literal('end_story'),
});

export const ActionSchema = z.union([SetFlagActionSchema, EndStoryActionSchema]);

const BaseMediaSchema = z.object({
    id: z.string(),
});

const PlayableMediaSchema = z.object({
    autoplay: z.boolean(),
    loop: z.boolean(),
    volume: z.number(),
});

const VisualMediaSchema = z.object({
    layout: z.enum(['cover', 'contain', 'fill', 'original']),
    x: z.number().optional(),
    y: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
});

const ImageMediaSchema = BaseMediaSchema.extend({
    type: z.literal('image'),
    url: z.string().url(),
}).merge(VisualMediaSchema);

const VideoMediaSchema = BaseMediaSchema.extend({
    type: z.literal('video'),
    url: z.string().url(),
}).merge(VisualMediaSchema).merge(PlayableMediaSchema);

const AudioMediaSchema = BaseMediaSchema.extend({
    type: z.literal('audio'),
    url: z.string().url(),
}).merge(PlayableMediaSchema);

const PluginMediaSchema = BaseMediaSchema.extend({
    type: z.literal('plugin'),
    pluginId: z.string(),
});

const MediaSchema = z.union([ImageMediaSchema, VideoMediaSchema, AudioMediaSchema, PluginMediaSchema]);

// Main schemas
export const ConditionalPromptsSchema = z.object({
    id: z.string(),
    body: z.string(),
    conditions: z.array(ConditionSchema),
    media: z.array(MediaSchema),
});

export const ResponseSchema = z.object({
    id: z.string(),
    text: z.string(),
    conditions: z.array(ConditionSchema),
    media: z.array(MediaSchema),
});

export const StoryNodeSchema = z.object({
    id: z.string(),
    nodeOrder: z.number(),
    storyId: z.string(),
    type: z.literal('conversation').default('conversation'),
    prompt: z.array(ConditionalPromptsSchema),
    responses: z.array(ResponseSchema),
    media: z.array(MediaSchema),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export const StorySchema = z.object({
    id: z.string(),
    title: z.string(),
    nodes: z.array(StoryNodeSchema),
    deleted: z.boolean(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

// Inferred types
export type Story = z.infer<typeof StorySchema>;
/* Old definition:
export interface Story {
    id: string;
    title: string;
    nodes: StoryNode[];
    deleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}
*/

export type StoryNode = z.infer<typeof StoryNodeSchema>;
/* Old definition:
export interface StoryNode {
    id: string;
    nodeOrder: number;
    storyId: string;
    type: "conversation";
    prompt: ConditionalPrompts[];
    responses: Response[];
    media: Media[];
    createdAt?: string;
    updatedAt?: string;
}
*/

export type ConditionalPrompts = z.infer<typeof ConditionalPromptsSchema>;
/* Old definition:
export interface ConditionalPrompts {
    id: string;
    body: string;
    conditions: Condition[];
    media: Media[];
}
*/

export type Response = z.infer<typeof ResponseSchema>;
/* Old definition:
export interface Response {
    id: string;
    text: string;
    conditions: Condition[];
    media: Media[];
}
*/

export type Flag = z.infer<typeof FlagSchema>;
/* Old definition:
export type Flag = BooleanFlag | NumberFlag | SelectFlag | AndCondition | OrCondition;
*/

export type Condition = z.infer<typeof ConditionSchema>;
/* Old definition:
export interface Condition {
    flag: Flag;
    type: ConditionType;
    targetValue: string | number | boolean;
}
*/

export type Action = z.infer<typeof ActionSchema>;
/* Old definition:
export type Action = SetFlagAction | EndStoryAction;
*/

export type Media = z.infer<typeof MediaSchema>;
/* Old definition:
export type Media = ImageMedia | VideoMedia | AudioMedia | PluginMedia;
*/

// Additional types that were not directly replaced but are still needed
export type ConditionType = z.infer<typeof ConditionSchema>['type'];

export type FlagBase = z.infer<typeof FlagBaseSchema>;
export type BooleanFlag = z.infer<typeof BooleanFlagSchema>;
export type NumberFlag = z.infer<typeof NumberFlagSchema>;
export type SelectFlag = z.infer<typeof SelectFlagSchema>;

export type BaseAction = z.infer<typeof BaseActionSchema>;
export type SetFlagAction = z.infer<typeof SetFlagActionSchema>;
export type EndStoryAction = z.infer<typeof EndStoryActionSchema>;

export type BaseMedia = z.infer<typeof BaseMediaSchema>;
export type PlayableMedia = z.infer<typeof PlayableMediaSchema>;
export type VisualMedia = z.infer<typeof VisualMediaSchema>;
export type ImageMedia = z.infer<typeof ImageMediaSchema>;
export type VideoMedia = z.infer<typeof VideoMediaSchema>;
export type AudioMedia = z.infer<typeof AudioMediaSchema>;
export type PluginMedia = z.infer<typeof PluginMediaSchema>;
