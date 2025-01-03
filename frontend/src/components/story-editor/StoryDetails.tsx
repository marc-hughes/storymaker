import React, { useState } from "react";
import AdbIcon from "@mui/icons-material/Adb";
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
import { ActivePluginsList } from './ActivePluginsList';
import { AvailablePlugins } from '../../plugins/plugin-list';

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
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDebugPanelOpen, setIsDebugPanelOpen] = useState(false); // New state for debug panel

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
    if (!story.id) return;
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
    
    if (
      deleteConfirmation.trim().toLowerCase() ===
      story.title.trim().toLowerCase()
    ) {
      if (!story.id) return;
      deleteStoryMutation.mutate(
        { id: story.id },
        {
          onSuccess: () => {
            navigate("/stories");
          },
        }
      );
      setOpenDeleteDialog(false);
    }
  };

  return (
    <StoryDetailsContainer>
      <DeleteButtonContainer>
        <Tooltip title="Debug Info" arrow>
          <IconButton
            size="sm"
            variant="soft"
            onClick={() => setIsDebugPanelOpen((prev) => !prev)}
          >
            <AdbIcon />
          </IconButton>
        </Tooltip>
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
            <Button onClick={handleSaveClick} size="sm">
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography level="h4">{story.title}</Typography>
            <IconButton onClick={handleEditClick} size="sm">
              <EditIcon />
            </IconButton>
          </>
        )}
      </TitleContainer>
      <Typography>Number of nodes: {story.nodes.length}</Typography>

      {/* Debug Panel */}
      {isDebugPanelOpen && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: "1px solid",
            borderColor: "neutral.outlinedBorder",
            borderRadius: "sm",
          }}
        >
          <Typography>Debug Info:</Typography>
          <pre>{JSON.stringify(story, null, 2)}</pre>
        </Box>
      )}

      <Modal open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h2">Confirm Deletion</Typography>
          <Divider />
          <Typography>
            Are you sure you want to delete this story? This action cannot be
            undone.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Please type <strong>{story.title}</strong> to confirm:
          </Typography>
          <input
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "8px",
              marginBottom: "16px",
            }}
          />
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}
          >
            <Button
              variant="plain"
              color="neutral"
              onClick={() => {
                setOpenDeleteDialog(false);
                setDeleteConfirmation("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleConfirmDelete}
              disabled={
                deleteConfirmation.trim().toLowerCase() !==
                story.title.trim().toLowerCase()
              }
            >
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>

      <ActivePluginsList plugins={AvailablePlugins} />
    </StoryDetailsContainer>
  );
};

export default StoryDetails;
