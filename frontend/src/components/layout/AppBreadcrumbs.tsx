import React from "react";
import { useMatch, PathMatch } from "react-router-dom";
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
  const possibleBreadcumbs: {
    route: PathMatch | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Breadcrumb: React.FC<any>;
  }[] = [
    {
      route: useMatch("/stories/:storyId/*"),
      Breadcrumb: StoryBreadcrumb,
    },
    {
      route: useMatch("/stories/:storyId"),
      Breadcrumb: StoryDetailscrumb,
    },
    {
      route: useMatch("/stories/:storyId/map"),
      Breadcrumb: NodeMapBreadcrumb,
    },
    {
      route: useMatch("/stories/:storyId/nodes"),
      Breadcrumb: NodeListBreadcrumb,
    },
    {
      route: useMatch("/stories/:storyId/node/*"),
      Breadcrumb: NodeListBreadcrumb,
    },
    {
      route: useMatch("/stories/:storyId/node/:nodeId"),
      Breadcrumb: NodeBreadcrumb,
    },
  ];

  return (
    <StyledBreadcrumbs
      size="sm"
      aria-label="breadcrumbs"
      separator={<ChevronRightRoundedIcon />}
    >
      <HomeBreadcrumb />
      {possibleBreadcumbs
        .filter(({ route }) => route)
        .map(({ Breadcrumb, route }) => (
          <Breadcrumb {...route?.params} />
        ))}
    </StyledBreadcrumbs>
  );
};

const StoryDetailscrumb: React.FC = () => {
  return <StyledTypography color="primary">Story Details</StyledTypography>;
};

const NodeBreadcrumb: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  return <StyledTypography color="primary">Node {nodeId}</StyledTypography>;
};

const NodeMapBreadcrumb: React.FC<{ storyId: string }> = () => {
  return <StyledTypography color="primary">Node Map</StyledTypography>;
};

const HomeBreadcrumb: React.FC = () => {
  return (
    <Link underline="none" color="neutral" href="/" aria-label="Home">
      <HomeRoundedIcon />
    </Link>
  );
};

const truncateTitle = (title: string, maxLength: number) => {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
};

const NodeListBreadcrumb: React.FC<{ storyId: string }> = ({ storyId }) => {
  return <StyledLink href={`/stories/${storyId}/nodes`}>Node List</StyledLink>;
};

const StoryBreadcrumb: React.FC<{ storyId: string }> = ({ storyId }) => {
  const { data: story } = useGetStory(storyId || "");
  const title = story ? truncateTitle(story.title, 32) : "Loading...";
  return (
    <>
      <StyledLink href={`/stories/${storyId}`}>{title}</StyledLink>
    </>
  );
};
