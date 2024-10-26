import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  IconButton,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  Divider,
  Box,
  Tooltip,
} from "@mui/joy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/joy/styles";
import {
  useGetStory,
  useUpdateStory,
  useDeleteStory,
} from "../../services/useStoryQueries";

const StoryDetailsContainer = styled("div")(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.vars.palette.background.level1,
  borderRadius: theme.radius.md,
  position: "relative",
}));

const TitleContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
  marginTop: "20px",
  gap: "8px",
});

const TitleInput = styled("input")(({ theme }) => ({
  fontSize: theme.fontSize.xl2,
  padding: theme.spacing(1),
  border: `1px solid ${theme.vars.palette.neutral.outlinedBorder}`,
  borderRadius: theme.radius.sm,
  flexGrow: 1,
  color: theme.vars.palette.text.primary,
  backgroundColor: theme.vars.palette.background.surface,
}));

const DeleteButtonContainer = styled("div")({
  position: "absolute",
  top: "8px",
  right: "8px",
});

const StoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedTitle, setEditedTitle] = React.useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const { data: story, isLoading } = useGetStory(id || "");
  const updateStoryMutation = useUpdateStory();
  const deleteStoryMutation = useDeleteStory();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!story) return <Typography>Story not found</Typography>;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTitle(story.title);
  };

  const handleSaveClick = () => {
    updateStoryMutation.mutate(
      { id: story.id, title: editedTitle },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    deleteStoryMutation.mutate(
      { id: story.id },
      {
        onSuccess: () => {
          navigate("/stories");
        },
      }
    );
    setOpenDeleteDialog(false);
  };

  return (
    <StoryDetailsContainer>
      <DeleteButtonContainer>
        <Tooltip title="Delete Story" arrow>
          <IconButton
            size="sm"
            color="danger"
            variant="soft"
            onClick={handleDeleteClick}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </DeleteButtonContainer>
      <TitleContainer>
        {isEditing ? (
          <>
            <TitleInput
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <Button
              onClick={handleSaveClick}
              startDecorator={<EditIcon />}
              size="sm"
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography level="h4">{story.title}</Typography>
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </TitleContainer>
      <Typography>Number of nodes: {story.nodes.length}</Typography>
      <Modal open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h2">Confirm Deletion</Typography>
          <Divider />
          <Typography>Are you sure you want to delete this story?</Typography>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}
          >
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenDeleteDialog(false)}
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
        </ModalDialog>
      </Modal>
    </StoryDetailsContainer>
  );
};

export default StoryDetails;
