import React, { useEffect, useState } from "react";
import { getStories, createStory, deleteStory } from "../services/api";
import { Story } from "../types/story-maker";
import {
  Button,
  List,
  ListItem,
  Typography,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
  FormControl,
  FormLabel,
  Input,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StoryList: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const token = getAccessToken() || "";

  const fetchStories = async () => {
    const data = await getStories(token);
    setStories(data);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleCreate = async () => {
    const newStory = await createStory(token, title);
    setStories([...stories, newStory]);
    setOpen(false);
    setTitle("");
  };

  const handleDelete = async (id: string) => {
    await deleteStory(token, id);
    setStories(stories.filter((story) => story.id !== id));
  };

  return (
    <div>
      <Typography level="h4">My Stories</Typography>
      <Button onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Create New Story
      </Button>
      <List>
        {stories.map((story) => (
          <ListItem
            key={story.id}
            endAction={
              <Button color="danger" onClick={() => handleDelete(story.id)}>
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
          </ListItem>
        ))}
      </List>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4">Create New Story</Typography>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleCreate();
            }}
          >
            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>Title</FormLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  autoFocus
                />
              </FormControl>
              <Button type="submit">Create</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default StoryList;
