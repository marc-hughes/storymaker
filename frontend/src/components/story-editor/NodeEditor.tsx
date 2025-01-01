import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Snackbar,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
} from "@mui/joy";
import { styled } from "@mui/joy/styles";
import { useGetStory, useUpdateNode } from "../../services/useStoryQueries";
import { StoryNode } from "../../types/story-maker";
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
