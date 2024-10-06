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

export const StoryTable: React.FC<{ stories: Story[] }> = ({ stories }) => {
  return (
    <Sheet
      className="StoryListTableContainer"
      variant="outlined"
      sx={{
        display: { xs: "none", sm: "initial" },
        width: "100%",
        borderRadius: "sm",
        flexShrink: 1,
        overflow: "auto",
        minHeight: 0,
      }}
    >
      <Table
        aria-labelledby="tableTitle"
        stickyHeader
        hoverRow
        sx={{
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
            <th style={{ width: 140, padding: "12px 6px" }}>Title</th>
            <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
            <th style={{ width: 240, padding: "12px 6px" }}>Customer</th>
            <th style={{ width: 140, padding: "12px 6px" }}> </th>
          </tr>
        </thead>
        <tbody>
          {stories.map((row: Story) => (
            <tr key={row.id}>
              {/* <td style={{ textAlign: "center", width: 120 }}>
                <Checkbox
                  size="sm"
                  checked={selected.includes(row.id)}
                  color={selected.includes(row.id) ? "primary" : undefined}
                  onChange={(event) => {
                    setSelected((ids) =>
                      event.target.checked
                        ? ids.concat(row.id)
                        : ids.filter((itemId) => itemId !== row.id)
                    );
                  }}
                  slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </td> */}
              <td>
                <Typography level="body-xs">{row.id}</Typography>
              </td>
              <td>
                <Typography level="body-xs">{row.UpdatedAt}</Typography>
              </td>

              <td>
                <Typography level="body-xs">{row.CreatedAt}</Typography>
              </td>
              {/* <td>
                <Chip
                  variant="soft"
                  size="sm"
                  startDecorator={
                    {
                      Paid: <CheckRoundedIcon />,
                      Refunded: <AutorenewRoundedIcon />,
                      Cancelled: <BlockIcon />,
                    }[row.status]
                  }
                  color={
                    {
                      Paid: "success",
                      Refunded: "neutral",
                      Cancelled: "danger",
                    }[row.status] as ColorPaletteProp
                  }
                >
                  {row.status}
                </Chip>
              </td> */}
              {/* <td>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar size="sm">{row.customer.initial}</Avatar>
                  <div>
                    <Typography level="body-xs">{row.customer.name}</Typography>
                    <Typography level="body-xs">
                      {row.customer.email}
                    </Typography>
                  </div>
                </Box>
              </td> */}
              <td>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <NavLink to={`/stories/${row.id}`}>Edit</NavLink>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};
