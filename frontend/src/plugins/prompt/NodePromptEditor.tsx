import { NodeEditorProps } from "../../types/story-maker";
import { PromptPluginData, PromptPluginDataSchema } from "./prompt-types";
import { styled } from '@mui/joy/styles';
import { Sheet, Typography } from "@mui/joy";
import { v4 as uuidv4 } from 'uuid';
import { RichTextEditor } from "../../components/rich-text/RichTextEditor";

const EditorContainer = styled(Sheet)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));

const PromptContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  border: `1px solid ${theme.vars.palette.divider}`,
  borderRadius: theme.radius.sm,
}));

const AddPromptButton = styled('button')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.vars.palette.background.level1,
  border: `1px solid ${theme.vars.palette.divider}`,
  borderRadius: theme.radius.sm,
  cursor: 'pointer',
  
  '&:hover': {
    backgroundColor: theme.vars.palette.background.level2,
  }
}));

export const NodePromptEditor: React.FC<NodeEditorProps<PromptPluginData>> = ({
  pluginData,
  node,
  setPluginData,
  // setNode,
  // story,
  // setStory,
}) => {
  const activeData = PromptPluginDataSchema.parse(pluginData);

  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...activeData.prompts];
    newPrompts[index] = {
      ...newPrompts[index],
      body: value,
    };

    if(setPluginData) { setPluginData({
        ...activeData,
        prompts: newPrompts,
      });
    }

    
  };

  const addNewPrompt = () => {
    if(!setPluginData) return;
    setPluginData({
      ...activeData,
      prompts: [
        ...activeData.prompts,
        {
          id: uuidv4(),
          body: '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}',
          conditions: [],
          media: [],
        },
      ],
    });
  };

  return (
    <EditorContainer variant="outlined">
      <Typography level="h4">Prompts</Typography>
      {activeData.prompts.map((prompt, index) => (
        <PromptContainer key={prompt.id}>
          <RichTextEditor
            value={prompt.body}
            onChange={(value) => handlePromptChange(index, value)}
          />
          {/* TODO: Add condition editor and media editor */}
        </PromptContainer>
      ))}
      <AddPromptButton onClick={addNewPrompt}>Add Prompt</AddPromptButton>
    </EditorContainer>
  );
};
