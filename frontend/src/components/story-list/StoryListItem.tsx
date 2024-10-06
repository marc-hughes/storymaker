import React, { useState } from "react";
import {
  ListItem,
  Button,
  Modal,
  Typography,
  Box,
  CircularProgress,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { useDeleteStory } from "../../services/useStoryQueries";

interface StoryListItemProps {
  story: {
    id: string;
    title: string;
  };
}

const StyledListItem = styled(ListItem)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalContent = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StoryListItem: React.FC<StoryListItemProps> = ({ story }) => {
  const navigate = useNavigate();
  const deleteStoryMutation = useDeleteStory();
  const handleDelete = async () => {
    return deleteStoryMutation.mutateAsync({ id: story.id });
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleConfirmDelete = async () => {
    await handleDelete();
    handleCloseDeleteModal();
  };

  return (
    <>
      <StyledListItem
        key={story.id}
        endAction={
          <Button color="danger" onClick={handleOpenDeleteModal}>
            Delete
          </Button>
        }
      >
        <Button
          variant="plain"
          onClick={() => navigate(`/stories/${story.id}`)}
        >
          {story.title}
        </Button>
      </StyledListItem>

      <Modal open={isDeleteModalOpen} onClose={handleCloseDeleteModal}>
        <ModalContent>
          <Typography level="h4">Confirm Delete</Typography>
          <Typography>
            Are you sure you want to delete "{story.title}"?
          </Typography>
          {deleteStoryMutation.isPending && (
            <Typography>
              Deleting... <CircularProgress color="danger" />
            </Typography>
          )}
          {deleteStoryMutation.isPending || (
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                color="danger"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </Box>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default StoryListItem;
