import React, { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Button,
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

import { useCreateStory, useGetStories } from "../../services/useStoryQueries";
import { StoryTable } from "./StoryTable";
import { StorySchema } from "../../types/story-maker";

const StoryList: React.FC = () => {
  //const [stories, setStories] = useState<Story[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");

  const { isPending, error, data: stories } = useGetStories();
  const createStoryMutation = useCreateStory();
  const handleCreate = async () => {
    const newStory = StorySchema.parse({ title });
    await createStoryMutation.mutateAsync(newStory);
    setOpen(false);
    setTitle("");
  };

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography level="h4">My Stories</Typography>

        <Button
          variant="solid"
          color="success"
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          <AddRoundedIcon />
          New Story
        </Button>
      </Stack>
      <Snackbar
        open={createStoryMutation.isSuccess}
        autoHideDuration={3000}
        onClose={() => createStoryMutation.reset()}
      >
        Story Created
      </Snackbar>

      <StoryTable stories={stories} />

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
