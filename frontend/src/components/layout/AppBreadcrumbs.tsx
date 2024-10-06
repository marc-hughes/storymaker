import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Typography } from "@mui/joy";
import { Route, Routes } from "react-router";

export const AppBreadcrumbs = () => {
  return (
    <Breadcrumbs
      size="sm"
      aria-label="breadcrumbs"
      separator={<ChevronRightRoundedIcon />}
      sx={{ pl: 0 }}
    >
      <Link
        underline="none"
        color="neutral"
        href="#some-link"
        aria-label="Home"
      >
        <HomeRoundedIcon />
      </Link>

      <Link
        underline="hover"
        color="neutral"
        href="#some-link"
        sx={{ fontSize: 12, fontWeight: 500 }}
      >
        My Story Title
      </Link>
      <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
        My Node
      </Typography>
    </Breadcrumbs>
  );
};
