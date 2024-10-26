import {
  Avatar,
  Box,
  Checkbox,
  Link,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { Story } from "../../types/story-maker";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/joy/styles";

const StyledLink = styled(NavLink)(({ theme }) => ({
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

export const StoryTable: React.FC<{ stories: Story[] }> = ({ stories }) => {
  return (
    <Table
      aria-labelledby="tableTitle"
      stickyHeader
      hoverRow
      sx={{
        marginTop: 3,
        "--TableCell-headBackground": "var(--joy-palette-background-level1)",
        "--Table-headerUnderlineThickness": "1px",
        "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
        "--TableCell-paddingY": "4px",
        "--TableCell-paddingX": "8px",
      }}
    >
      <thead>
        <tr>
          {/* <th style={{ width: 48, textAlign: "center", padding: "12px 6px" }}>
              <Checkbox
                size="sm"
                indeterminate={
                  selected.length > 0 && selected.length !== rows.length
                }
                checked={selected.length === rows.length}
                onChange={(event) => {
                  setSelected(
                    event.target.checked ? rows.map((row) => row.id) : []
                  );
                }}
                color={
                  selected.length > 0 || selected.length === rows.length
                    ? "primary"
                    : undefined
                }
                sx={{ verticalAlign: "text-bottom" }}
              />
            </th> */}
          {/* <th style={{ width: 120, padding: "12px 6px" }}>
              <Link
                underline="none"
                color="primary"
                component="button"
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                endDecorator={<ArrowDropDownIcon />}
                sx={[
                  {
                    fontWeight: "lg",
                    "& svg": {
                      transition: "0.2s",
                      transform:
                        order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                    },
                  },
                  order === "desc"
                    ? { "& svg": { transform: "rotate(0deg)" } }
                    : { "& svg": { transform: "rotate(180deg)" } },
                ]}
              >
                Invoice
              </Link>
            </th> */}
          <th style={{ width: 300, padding: "12px 6px" }}>Title</th>
          <th style={{ width: 140, padding: "12px 6px" }}>Updated At</th>
          <th style={{ width: 140, padding: "12px 6px" }}>Created At</th>
          <th style={{ width: 140, padding: "12px 6px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {stories.map((row: Story) => (
          <tr key={row.id}>
            <td>
              <Typography level="body-sm">
                <StyledLink to={`/stories/${row.id}`}>{row.title}</StyledLink>
              </Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.updatedAt}</Typography>
            </td>
            <td>
              <Typography level="body-xs">{row.CreatedAt}</Typography>
            </td>
            <td>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <StyledLink to={`/stories/${row.id}/preview`}>
                  Preview
                </StyledLink>
              </Box>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
