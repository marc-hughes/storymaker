import React from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/joy";
import { useGetStory } from "../../services/useStoryQueries";

const StoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: story, isLoading } = useGetStory(id || "");

  if (isLoading) return <Typography>Loading...</Typography>;
  if (!story) return <Typography>Story not found</Typography>;

  return (
    <div>
      <Typography level="h4">{story.title}???</Typography>
    </div>
  );
};

export default StoryDetails;
