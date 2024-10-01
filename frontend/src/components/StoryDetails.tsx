import React, { useCallback, useEffect, useState } from "react";
import { getStory, updateStory } from "../services/api";
import { Story } from "../types/story-maker";
import { useParams } from "react-router-dom";
import {
  Typography,
  Input,
  Button,
  Modal,
  ModalDialog,
  ModalClose,
  FormControl,
  FormLabel,
} from "@mui/joy";
import NodeList from "./NodeList";
import { useAuth } from "../context/AuthContext";

const StoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const { getAccessToken } = useAuth();
  const token = getAccessToken() || "";

  const [open, setOpen] = useState(false);

  const fetchStory = useCallback(async () => {
    if (id) {
      const data = await getStory(token, id);
      setStory(data);
      setTitle(data.title);
    }
  }, [id]);

  useEffect(() => {
    fetchStory();
  }, [fetchStory, id]);

  const handleUpdate = async () => {
    if (id) {
      const updatedStory = await updateStory(token, id, title);
      setStory(updatedStory);
      setEditing(false);
    }
  };

  if (!story) return <Typography>Loading...</Typography>;

  return (
    <div>
      {editing ? (
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog>
            <ModalClose />
            <Typography level="h4">Edit Story Title</Typography>
            <FormControl required>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
            </FormControl>
            <Button onClick={handleUpdate} sx={{ mr: 1 }}>
              Save
            </Button>
            <Button onClick={() => setEditing(false)} color="neutral">
              Cancel
            </Button>
          </ModalDialog>
        </Modal>
      ) : (
        <>
          <Typography level="h4">{story.title}</Typography>
          <Button
            onClick={() => {
              setEditing(true);
              setOpen(true);
            }}
            sx={{ mb: 2 }}
          >
            Edit Title
          </Button>
        </>
      )}
      <NodeList
        storyId={story.id}
        nodes={story.nodes}
        refreshStory={fetchStory}
      />
    </div>
  );
};

export default StoryDetails;
