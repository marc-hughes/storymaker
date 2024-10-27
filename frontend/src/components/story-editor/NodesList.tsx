import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Typography,
  Sheet,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/joy";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import styled from "@emotion/styled";
import { useGetStory, useCreateNode } from "../../services/useStoryQueries";
import { StoryNode } from "../../types/story-maker";

const StyledSheet = styled(Sheet)`
  height: 100%;
  overflow: auto;
  margin-top: 16px;
`;

const NarrowColumn = styled.td`
  width: 90px;
  text-align: center;
`;

const NarrowHeader = styled.th`
  width: 90px;
  text-align: center;
`;

const ActionsColumn = styled.td`
  text-align: right;
`;

const ActionsHeader = styled.th`
  text-align: right !important;
`;

const NodesList: React.FC = () => {
  const { id: storyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newNodeId, setNewNodeId] = useState<string | null>(null);
  const {
    data: story,
    isLoading,
    error,
    isFetching,
  } = useGetStory(storyId || "");
  const createNodeMutation = useCreateNode();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error)
    return <Typography color="danger">Error: {error.message}</Typography>;
  if (!story) return <Typography>No story found</Typography>;

  const handleCreateNode = async () => {
    if (storyId) {
      const newNode = await createNodeMutation.mutateAsync({
        storyId,
        node: {
          nodeOrder: (story.nodes.length + 1) * 10,
          type: "conversation",
          prompt: [],
          responses: [],
          media: [],
        },
      });
      // Store the new node ID in state
      setNewNodeId(newNode.id);
    }
  };

  const handleEditNewNode = () => {
    if (newNodeId) {
      navigate(`/stories/${storyId}/node/${newNodeId}`);
    }
  };

  const handleEditNode = (nodeId: string) => {
    navigate(`/stories/${storyId}/node/${nodeId}`);
  };

  const sortedNodes = [...story.nodes].sort(
    (a, b) => a.nodeOrder - b.nodeOrder
  );

  return (
    <div>
      <Typography level="h2" sx={{ mb: 2 }}>
        Nodes for "{story.title}"
        {isFetching && (
          <CircularProgress
            sx={{ position: "relative", left: 10, top: 4 }}
            size="sm"
          />
        )}
      </Typography>
      <Button
        variant="solid"
        color="primary"
        onClick={handleCreateNode}
        startDecorator={<AddRoundedIcon />}
        sx={{ mb: 2 }}
      >
        Add Node
      </Button>
      <StyledSheet>
        <Table hoverRow>
          <thead>
            <tr>
              <th>Prompt</th>
              <NarrowHeader>Responses</NarrowHeader>
              <ActionsHeader>Actions</ActionsHeader>
            </tr>
          </thead>
          <tbody>
            {sortedNodes.map((node: StoryNode) => (
              <tr key={node.id}>
                <td>{node.prompt[0]?.body || "No prompt"}</td>
                <NarrowColumn>{node.responses.length}</NarrowColumn>
                <ActionsColumn>
                  <Button
                    size="sm"
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleEditNode(node.id)}
                  >
                    Edit
                  </Button>
                </ActionsColumn>
              </tr>
            ))}
          </tbody>
        </Table>
      </StyledSheet>
      <Snackbar
        open={createNodeMutation.isSuccess}
        autoHideDuration={5000}
        onClose={() => {
          createNodeMutation.reset();
          setNewNodeId(null);
        }}
        color="success"
        variant="soft"
        endDecorator={
          <Button
            onClick={handleEditNewNode}
            size="sm"
            variant="solid"
            color="primary"
          >
            Edit New Node
          </Button>
        }
      >
        Node Created Successfully
      </Snackbar>
    </div>
  );
};

export default NodesList;
