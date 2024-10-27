import React from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Typography } from "@mui/joy";
import { useGetStory } from "../../services/useStoryQueries";
import styled from "@emotion/styled";

const StyledBreadcrumbs = styled(Breadcrumbs)`
  padding-left: 0;
`;

const StyledLink = styled(Link)`
  font-size: 12px;
  font-weight: 500;
`;

const StyledTypography = styled(Typography)`
  font-weight: 500;
  font-size: 12px;
`;

export const AppBreadcrumbs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: story } = useGetStory(id || "");

  const truncateTitle = (title: string, maxLength: number) => {
    return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
  };

  const storyTitle = story ? truncateTitle(story.title, 32) : "Loading...";

  return (
    <StyledBreadcrumbs
      size="sm"
      aria-label="breadcrumbs"
      separator={<ChevronRightRoundedIcon />}
    >
      <Link underline="none" color="neutral" href="/" aria-label="Home">
        <HomeRoundedIcon />
      </Link>

      {id && (
        <StyledLink underline="hover" color="neutral" href={`/story/${id}`}>
          {storyTitle}
        </StyledLink>
      )}

      <StyledTypography color="primary">My Node</StyledTypography>
    </StyledBreadcrumbs>
  );
};
