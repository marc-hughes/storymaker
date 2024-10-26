import * as React from "react";
import MapIcon from "@mui/icons-material/Map";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useParams, useLocation, Link } from "react-router-dom";

import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import AutoStoriesIcon from "@mui/icons-material/AutoStories";

import { closeSidebar } from "./utils";
import { Route, Routes } from "react-router";
import { useAuth } from "../../context/AuthContext";

export const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <Routes>
      <Route path="/" element={<StoryListSidebar onLogout={onLogout} />} />
      <Route
        path="/stories"
        element={<StoryListSidebar onLogout={onLogout} />}
      />
      <Route
        path="/stories/:id/*"
        element={<StorySidebar onLogout={onLogout} />}
      />
    </Routes>
  );
};

const StorySidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { id: storyId } = useParams<{ id: string }>();
  const location = useLocation();

  return (
    <CommonSidebar onLogout={onLogout}>
      <Input
        size="sm"
        startDecorator={<SearchRoundedIcon />}
        placeholder="Search"
      />
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton
              selected={location.pathname === `/stories/${storyId}`}
              component={Link}
              to={`/stories/${storyId}`}
            >
              <DisplaySettingsIcon />
              <ListItemContent>
                <Typography level="title-sm">Story Details</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={location.pathname === `/stories/${storyId}/map`}
              component={Link}
              to={`/stories/${storyId}/map`}
            >
              <MapIcon />
              <ListItemContent>
                <Typography level="title-sm">Node Map</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={location.pathname === `/stories/${storyId}/nodes`}
              component={Link}
              to={`/stories/${storyId}/nodes`}
            >
              <ListAltIcon />
              <ListItemContent>
                <Typography level="title-sm">Nodes List</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        ></List>
      </Box>
    </CommonSidebar>
  );
};

const StoryListSidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  return (
    <CommonSidebar onLogout={onLogout}>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton selected>
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Story List</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
        </List>
        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton>
              <SupportRoundedIcon />
              Support
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              Settings
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </CommonSidebar>
  );
};

const CommonSidebar: React.FC<{
  onLogout: () => void;
  children: React.ReactNode;
}> = ({ onLogout, children }) => {
  const { user } = useAuth();
  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <IconButton variant="soft" color="primary" size="sm">
          <AutoStoriesIcon />
        </IconButton>
        <Typography level="title-lg">Story Maker</Typography>
        {/* <ColorSchemeToggle sx={{ ml: "auto" }} /> */}
      </Box>
      {children}
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar variant="outlined" size="sm" />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">{user?.name}</Typography>
          <Typography
            level="body-xs"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email}
          </Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={onLogout}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
};
