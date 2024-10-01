import React, { useState } from "react";
import { StoryNode } from "../types/story-maker";
import { createNode, deleteNode } from "../services/api";
import {
  List,
  ListItem,
  Button,
  Modal,
  Typography,
  Input,
  FormControl,
  FormLabel,
  Sheet,
} from "@mui/joy";
import styled from "@emotion/styled";

interface NodeListProps {
  storyId: string;
  nodes: StoryNode[];
  refreshStory: () => void;
}

const NodeList: React.FC<NodeListProps> = ({
  storyId,
  nodes,
  refreshStory,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [nodeText, setNodeText] = useState<string>("");
  const { getAccessToken } = useAuth();
  const token = getAccessToken() || "";

  const handleCreate = async () => {
    await createNode(token, storyId, {
      type: "conversation",
      prompt: [],
      responses: [],
      media: [],
    });
    refreshStory();
    setOpen(false);
    setNodeText("");
  };

  const handleDelete = async (nodeId: string) => {
    await deleteNode(token, storyId, nodeId);
    refreshStory();
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Add Node
      </Button>
      <List>
        {nodes.map((node) => (
          <ListItem
            key={node.id}
            endAction={
              <Button color="danger" onClick={() => handleDelete(node.id)}>
                Delete
              </Button>
            }
          >
            {node.id} {/* Replace with node title or relevant info */}
          </ListItem>
        ))}
      </List>
      <StyledModal open={open} onClose={() => setOpen(false)}>
        <ModalContent>
          <Typography level="h4" component="h2">
            Create New Node
          </Typography>
          <FormControl required>
            <FormLabel>Node Text</FormLabel>
            <Input
              value={nodeText}
              onChange={(e) => setNodeText(e.target.value)}
              fullWidth
            />
          </FormControl>
          {/* Add more fields as necessary */}
          <ModalActions>
            <Button onClick={handleCreate}>Create</Button>
            <Button
              onClick={() => setOpen(false)}
              variant="soft"
              color="neutral"
            >
              Cancel
            </Button>
          </ModalActions>
        </ModalContent>
      </StyledModal>
    </div>
  );
};

const StyledModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Sheet)`
  width: 400px;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export default NodeList;
