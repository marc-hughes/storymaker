import { NodePlugin } from "../types/story-maker";
import { NodePromptPlugin } from "./prompt/NodePromptPlugin";
import { NodeResponsesPlugin } from "./responses/NodeResponsesPlugin";
// import NodeEditor from "../components/story-editor/NodeEditor";

// MARC - you were starting to implement the concept of Plugins.You still need to remove prompts & responses from the base 
// node Schema.Then add a way of configuring what plugins are available for a given story, then make the editors render
//     in the node NodeEditor, then make editors for each Plugin.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AvailablePlugins: NodePlugin<any>[] = [
    NodePromptPlugin,
    NodeResponsesPlugin,
]

export const DefaultPlugins = AvailablePlugins;