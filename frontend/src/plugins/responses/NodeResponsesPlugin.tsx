import ReplyIcon from "@mui/icons-material/Reply";
import { NodePlugin } from "../../types/story-maker";
import { NodePromptEditor as NodeResponsesEditor } from "./NodeResponsesEditor";
import { ResponsePluginData } from "./responses-types";

export const NodeResponsesPlugin: NodePlugin<ResponsePluginData> = {
  id: "node-responses",
  name: "Responses",
  description: "Allow the user to select from multiple responses in a node. (Default Story-Maker Plugin)",
  icon: <ReplyIcon />,
  preferredEditorOrder: 1,
  maxInstances: 1,
  Editor: NodeResponsesEditor,
};
