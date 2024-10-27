import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  FormControl,
  FormLabel,
  Input,
} from "@mui/joy";
import { styled } from "@mui/joy/styles";
import { useGetStory, useUpdateNode } from "../../services/useStoryQueries";
import {
  StoryNode,
  ConditionalPrompts,
  Response,
} from "../../types/story-maker";
import { useWorkingCopy } from "./useWorkingCopy";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const FormContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
}));

const NodeEditor: React.FC = () => {
  const { id: storyId, nodeId } = useParams<{ id: string; nodeId: string }>();
  const { data: story, isLoading } = useGetStory(storyId || "");
  const updateNodeMutation = useUpdateNode();

  const getNode = () => story?.nodes?.find((n) => n.id === nodeId) || null;
  const { workingCopy: nodeData, setWorkingCopy: setNodeData } = useWorkingCopy(
    getNode,
    [storyId, nodeId]
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);

  if (isLoading || !nodeData) return <CircularProgress />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFieldChange = (field: keyof StoryNode, value: any) => {
    setNodeData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handlePromptChange = (index: number, value: string) => {
    const updatedPrompt = [...(nodeData?.prompt || [])];
    updatedPrompt[index].body = value;
    handleFieldChange("prompt", updatedPrompt);
  };

  const handleAddPrompt = () => {
    const newPrompt: ConditionalPrompts = {
      id: "",
      body: "",
      conditions: [],
      media: [],
    };
    handleFieldChange("prompt", [...(nodeData?.prompt || []), newPrompt]);
  };

  const handleResponseChange = (index: number, value: string) => {
    const updatedResponses = [...(nodeData?.responses || [])];
    updatedResponses[index].text = value;
    handleFieldChange("responses", updatedResponses);
  };

  const handleAddResponse = () => {
    const newResponse: Response = {
      id: "",
      text: "",
      conditions: [],
      media: [],
    };
    handleFieldChange("responses", [
      ...(nodeData?.responses || []),
      newResponse,
    ]);
  };

  const handleSave = async () => {
    if (storyId && nodeId && nodeData) {
      await updateNodeMutation.mutateAsync({
        storyId,
        nodeId,
        node: nodeData,
      });
      setOpenSnackbar(true);
    }
  };

  return (
    <FormContainer>
      <Typography level="title-lg" sx={{ mb: 2 }}>
        Edit Node
      </Typography>
      <Stack spacing={2}>
        <FormControl required>
          <FormLabel>Node Order</FormLabel>
          <Input
            type="number"
            value={nodeData.nodeOrder}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFieldChange("nodeOrder", Number(e.target.value))
            }
          />
        </FormControl>
        <Typography level="title-md">Prompts</Typography>
        {nodeData.prompt.map((prompt, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <FormControl>
                <FormLabel>Prompt {index + 1}</FormLabel>
                <Input
                  value={prompt.body}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handlePromptChange(index, e.target.value)
                  }
                  fullWidth
                />
              </FormControl>
            </CardContent>
            <CardActions>{/* Add action buttons if necessary */}</CardActions>
          </Card>
        ))}
        <Button onClick={handleAddPrompt}>Add Prompt</Button>
        <Typography level="title-md">Responses</Typography>
        {nodeData.responses.map((response, index) => (
          <FormControl key={index}>
            <FormLabel>Response {index + 1}</FormLabel>
            <Input
              value={response.text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleResponseChange(index, e.target.value)
              }
            />
          </FormControl>
        ))}
        <Button onClick={handleAddResponse}>Add Response</Button>
        {/* Similarly, add UI elements for 'media', 'conditions', etc. */}
        <Button onClick={handleSave} variant="solid" color="primary">
          Save Changes
        </Button>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        Node updated successfully!
      </Snackbar>
    </FormContainer>
  );
};

export default NodeEditor;
