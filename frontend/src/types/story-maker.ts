export interface Story {
    id: string;
    title: string;
    nodes: StoryNode[];
    deleted: boolean;
    createdAt?: string;
    updatedAt?: string;
}

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

export interface ConditionalPrompts {
    id: string;
    body: string;
    conditions: Condition[];
    media: Media[];
}

export interface Response {
    id: string;
    text: string;
    conditions: Condition[];
    media: Media[];
}

export interface FlagBase {
    id: string;
    name: string;
}

export interface BooleanFlag extends FlagBase {
    type: "boolean";
    value: boolean;
    initialValue: boolean;
}

export interface NumberFlag extends FlagBase {
    type: "number";
    value: number;
    initialValue: number;
}

export interface SelectFlag extends FlagBase {
    type: "select";
    value: string;
    initialValue: string;
    options: string[];
}

export interface AndCondition {
    type: "and";
    conditions: Condition[];
}

export interface OrCondition {
    type: "or";
    conditions: Condition[];
}

type Flag = BooleanFlag | NumberFlag | SelectFlag | AndCondition | OrCondition;

type ConditionType = "equals" | "not_equals" | "greater_than" | "less_than" | "greater_than_or_equal_to" | "less_than_or_equal_to";

export interface Condition {
    flag: Flag;
    type: ConditionType;
    targetValue: string | number | boolean;
}

export interface BaseAction {
    id: string;
}

export interface SetFlagAction extends BaseAction {
    type: "set_flag";
    flag: Flag;
    value: string | number | boolean;
}

export interface EndStoryAction extends BaseAction {
    type: "end_story";
}

export type Action = SetFlagAction | EndStoryAction;


export interface BaseMedia {
    id: string;
}

export interface PlayableMedia {
    autoplay: boolean;
    loop: boolean;
    volume: number;
}

export interface VisualMedia {
    layout: "cover" | "contain" | "fill" | "original";
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export interface ImageMedia extends BaseMedia, VisualMedia {
    type: "image";
    url: string;
}

export interface VideoMedia extends BaseMedia, VisualMedia, PlayableMedia {
    type: "video";
    url: string;
}

export interface AudioMedia extends BaseMedia, PlayableMedia {
    type: "audio";
    url: string;
}

export interface PluginMedia extends BaseMedia {
    type: "plugin";
    pluginId: string;
}

type Media = ImageMedia | VideoMedia | AudioMedia | PluginMedia;