import React from 'react';
import { z } from 'zod';
import { DefaultPlugins } from '../plugins/plugin-list';

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

export const ConditionSchema = z.object({
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

export const MediaSchema = z.union([ImageMediaSchema, VideoMediaSchema, AudioMediaSchema, PluginMediaSchema]);


export type NodeEditorProps<T = unknown> = {
    story: Story;
    node: StoryNode;
    pluginData: T;
    setNode?: (node: StoryNode) => void;
    setStory?: (story: Story) => void;
}



export type NodePlayerProps = {
    story: Story;
    node: StoryNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pluginData: Record<string, any>;
}

interface NodePluginEventParams {
    node: StoryNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pluginData: Record<string, any>;
}

interface NodePluginEventParams {
    name: string;
    from: string; // ID of the plugin that triggered the event, or `system`
    data: Record<string, unknown>;
}

export interface NodePluginPlayer {
    onNodeStart: (params: NodePluginEventParams) => void;
    onNodeEnd: (params: NodePluginEventParams) => void;
    onNodeEvent: (params: NodePluginEventParams | NodePluginEventParams) => void;
    sendEvent: (name: string, data: Record<string, unknown>) => void;
    PlayerVisual?: React.FC<NodePlayerProps>;
    // Lots more to go here eventually...    
}

export interface NodePlugin<PluginDataType> {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    preferredEditorOrder: number;
    maxInstances: number; // Can this plugin be added multiple times to a node?
    Editor: React.FC<NodeEditorProps<PluginDataType>>;
    player?: NodePluginPlayer;
}

export const PluginDataSchema = z.object({
    pluginId: z.string(),
    data: z.record(z.any()),
});

export const StoryNodeSchema = z.object({
    id: z.string(),
    label: z.string(),
    nodeOrder: z.number(),
    storyId: z.string(),
    type: z.literal('conversation').default('conversation'),
    media: z.array(MediaSchema),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    pluginData: z.array(PluginDataSchema)
});

export const StorySchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    nodes: z.array(StoryNodeSchema).default([]),
    activePlugins: z.array(z.string()).default(
        DefaultPlugins.map(plugin => plugin.id)
    ),
    deleted: z.boolean().default(false),
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
