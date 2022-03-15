import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useLoaderData } from "remix";
import { StudenType } from "~/controllers/courseController";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function DashboardTable() {
  const data: StudenType = useLoaderData();
  const { courseData } = data;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table" size="small">
        <TableHead>
          <TableRow>
            <StyledTableCell>Course</StyledTableCell>
            <StyledTableCell align="right">Lecturer</StyledTableCell>
            <StyledTableCell align="right">Lectures Attended</StyledTableCell>
            <StyledTableCell align="right">Lectures Conducted</StyledTableCell>
            <StyledTableCell align="right">Percentage</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {courseData.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.lecturer}</StyledTableCell>
              <StyledTableCell align="right">{row.attended}</StyledTableCell>
              <StyledTableCell align="right">{row.conducted}</StyledTableCell>
              <StyledTableCell align="right">
                {row.percentage.toFixed(2) + "%"}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
