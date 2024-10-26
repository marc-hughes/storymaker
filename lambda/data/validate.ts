import { z } from 'zod';
import type {
    Story,
    StoryNode,
    ConditionalPrompts,
    Response,
    Flag,
    Condition,
    Action,
    Media
} from '../../frontend/src/types/story-maker';

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

const FlagSchema: z.ZodType<Flag> = z.lazy(() =>
    z.union([
        BooleanFlagSchema,
        NumberFlagSchema,
        SelectFlagSchema,
        z.object({
            type: z.literal('and'),
            conditions: z.array(ConditionSchema),
        }),
        z.object({
            type: z.literal('or'),
            conditions: z.array(ConditionSchema),
        }),
    ])
);

const ConditionSchema: z.ZodType<Condition> = z.object({
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

const ActionSchema: z.ZodType<Action> = z.union([SetFlagActionSchema, EndStoryActionSchema]);

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

const MediaSchema: z.ZodType<Media> = z.union([ImageMediaSchema, VideoMediaSchema, AudioMediaSchema, PluginMediaSchema]);

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

// Function to validate and clean up API input
export function validateStory(input: unknown): Story {
    return StorySchema.parse(input);
}

// You can create similar functions for other types if needed
export function validateStoryNode(input: unknown): StoryNode {
    return StoryNodeSchema.parse(input);
}

