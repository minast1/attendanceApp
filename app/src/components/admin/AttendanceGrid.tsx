/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Chip from "@mui/material/Chip";
import StyledGrid from "../StyledGrid";

function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

interface QuickSearchToolbarProps {
  clearSearch: () => void;
  onChange: () => void;
  value: string;
}

//ype Status = 'High' | 'Low' | 'Regular'

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Student Name", width: 200 },
  {
    field: "index",
    headerName: "Student Id",
    width: 150,
    align: "center",
    headerAlign: "center",
  },
  { field: "attend", headerName: "Lecs.Attended", type: "number", width: 150 },
  { field: "percentage", headerName: "Percentage", type: "number", width: 120 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    align: "right",
    headerAlign: "right",
    renderCell: (params: GridValueGetterParams) => {
      return (
        <Chip
          label={params.value}
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

const dataRows = [
  {
    id: 1,
    name: "Snow Abugri",
    index: "10094966",
    attend: 35,
    percentage: 60,
    status: "High",
  },
  {
    id: 2,
    name: "Lannister Santora",
    index: "10094967",
    attend: 42,
    percentage: 60,
    status: "High",
  },
  {
    id: 3,
    name: "Lannister Geera",
    index: "10094968",
    attend: 45,
    percentage: 60,
    status: "Low",
  },
  {
    id: 4,
    name: "Arya Stark",
    index: "10094969",
    attend: 16,
    percentage: 60,
    status: "Low",
  },
  {
    id: 5,
    name: "Daenerys Targaryen",
    index: "10094970",
    attend: 35,
    percentage: 60,
    status: "Low",
  },
  {
    id: 6,
    name: "Slanislave Melisandre",
    index: "10094971",
    attend: 150,
    percentage: 60,
    status: "Regular",
  },
  {
    id: 7,
    name: "Ferrara Clifford",
    index: "10094972",
    attend: 44,
    percentage: 60,
    status: "High",
  },
  {
    id: 8,
    name: "Rossini Frances",
    index: "10094973",
    attend: 36,
    percentage: 60,
    status: "Regular",
  },
  {
    id: 9,
    name: "Harvey Roxie",
    index: "10094974",
    attend: 65,
    percentage: 60,
    status: "High",
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
  const [searchText, setSearchText] = React.useState("");
  const [rows, setRows] = React.useState<any[]>([]);

  const requestSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = dataRows.filter((row: any) => {
      return Object.keys(row).some((field: any) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  React.useEffect(() => {
    setRows(dataRows);
  }, [dataRows]);

  //console.log(rows);

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
