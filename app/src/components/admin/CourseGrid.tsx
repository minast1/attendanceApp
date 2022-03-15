import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import StyledGrid from "../StyledGrid";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useFetcher } from "remix";
import { Course } from "@prisma/client";

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

//type Status = 'High' | 'Low' | 'Regular'

type ActionProps = {
  index: string;
};
const Actions = ({ index }: ActionProps) => {
  const fetcher = useFetcher();
  return (
    <Stack direction="row" spacing={3}>
      <IconButton
        aria-label="delete"
        size="small"
        prefetch="render"
        component={Link}
        to={`/admin/administrator/${index}`}
      >
        <EditIcon color="primary" />
      </IconButton>
      <IconButton
        aria-label="edit"
        size="small"
        onClick={() =>
          fetcher.submit(
            { id: index },
            { method: "delete", action: `/admin/administrator/${index}` }
          )
        }
      >
        <DeleteIcon color="error" />
      </IconButton>
    </Stack>
  );
};
const columns: GridColDef[] = [
  { field: "name", headerName: "Course Name", width: 350 },
  {
    field: "code",
    headerName: "Course Code",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  { field: "level", headerName: "Course Level", width: 150, align: "center" },
  { field: "semester", headerName: "Semester", width: 120, align: "center" },

  {
    field: "actions",
    headerName: "Actions",
    width: 165,
    align: "right",
    headerAlign: "right",
    renderCell: (params: GridValueGetterParams) => (
      <Actions index={params.row.id} />
    ),
  },
];

function QuickSearchToolbar(props: QuickSearchToolbarProps) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search Course…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto",
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5,
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
      />
    </Box>
  );
}

export default function CourseGrid({ data }: { data: Course[] }) {
  const [searchText, setSearchText] = React.useState("");
  const [rows, setRows] = React.useState<Course[]>(data);

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = data.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  React.useEffect(() => {
    setRows(data);
  }, [data]);

  //console.log(rows);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <StyledGrid
        components={{ Toolbar: QuickSearchToolbar }}
        rows={rows}
        disableColumnFilter
        autoPageSize
        disableColumnMenu
        disableVirtualization
        disableColumnSelector
        disableSelectionOnClick
        loading={rows.length === 0}
        columns={columns}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
              requestSearch(event.target.value),
            clearSearch: () => requestSearch(""),
          },
        }}
      />
    </div>
  );
}
