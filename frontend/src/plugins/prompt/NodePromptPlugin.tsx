import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { NodePlugin } from "../../types/story-maker";
import { NodePromptEditor } from "./NodePromptEditor";
import { PromptPluginData } from "./prompt-types";

export const NodePromptPlugin: NodePlugin<PromptPluginData> = {
  id: "node-prompt",
  name: "Prompt",
  description: "Add a prompt to a node (Default Story-Maker Plugin)",
  icon: <QuestionAnswerIcon />,
  preferredEditorOrder: 1,
  maxInstances: 1,
  Editor: NodePromptEditor,
};
