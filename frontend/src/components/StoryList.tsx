import React, { useState } from "react";
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
  Snackbar,
} from "@mui/joy";
import { useNavigate } from "react-router-dom";

import {
  useCreateStory,
  useDeleteStory,
  useGetStories,
} from "../services/useStoryQueries";

const StoryList: React.FC = () => {
  //const [stories, setStories] = useState<Story[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const navigate = useNavigate();
  const { isPending, error, data: stories } = useGetStories();
  const createStoryMutation = useCreateStory();
  const deleteStoryMutation = useDeleteStory();

  const handleCreate = async () => {
    await createStoryMutation.mutateAsync({ title });
    //setStories([...stories, newStory]);
    setOpen(false);
    setTitle("");
  };

  const handleDelete = async (id: string) => {
    deleteStoryMutation.mutate({ id });
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Typography level="h4">My Stories</Typography>

      <Snackbar
        open={createStoryMutation.isSuccess}
        autoHideDuration={3000}
        onClose={() => createStoryMutation.reset()}
      >
        Story Created
      </Snackbar>

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
