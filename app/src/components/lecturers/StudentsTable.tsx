import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Chip from "@mui/material/Chip";
import StyledGrid from "../StyledGrid";
import { useRouteData } from "remix-utils";
import { Stats } from "~/controllers/studentController";
import Typography from "@mui/material/Typography";

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

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
        placeholder="Search Student…"
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

export default function StudentsTable() {
  const parentData = useRouteData<Stats[]>("/lecturer/dashboard"); ///THIS IS WHAT WE NEED !!!!!!

  const [searchText, setSearchText] = React.useState("");
  const [rows, setRows] = React.useState<Stats[]>([]);

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = parentData
      ? parentData.filter((row: any) => {
          return Object.keys(row).some((field: any) => {
            return searchRegex.test(row[field].toString());
          });
        })
      : [];
    setRows(filteredRows);
  };

  React.useEffect(() => {
    if (parentData) {
      setRows(parentData);
    }
  }, [parentData]);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Student Name", width: 250 },
    {
      field: "indexnumber",
      headerName: "Student Id",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "group",
      headerName: "Student Group",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "attend",
      headerName: "Lecs.Attended",
      type: "number",
      width: 150,
    },
    {
      field: "total",
      headerName: "Lecs.Conducted",
      type: "number",
      width: 150,
    },
    {
      field: "percentage",
      headerName: "Percentage %",
      type: "number",
      width: 120,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 1,
      align: "right",
      headerAlign: "right",
      renderCell: (params: GridValueGetterParams) => {
        return (
          <Chip
            label={
              <Typography sx={{ fontSize: 12, fontWeight: "bold" }}>
                {params.value}
              </Typography>
            }
            color={
              params.value === "High"
                ? "success"
                : params.value === "Regular"
                ? "primary"
                : "error"
            }
            size="small"
          />
        );
      },
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <StyledGrid
        components={{ Toolbar: QuickSearchToolbar }}
        rows={rows}
        disableColumnFilter
        autoPageSize
        disableColumnMenu
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
