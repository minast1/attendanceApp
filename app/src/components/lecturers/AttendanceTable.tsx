import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useFetcher, useLoaderData } from "remix";
import { lecturerWithInfo } from "~/controllers/lecturerController";
import { Attendance } from "@prisma/client";
import { format } from "date-fns";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import { toLowerCase } from "~/lib/constants";
import RealtimeTable from "./RealtimeTable";
import { useRevalidate } from "remix-utils";

type rowType = {
  row: Attendance & {
    students: {
      signedAt: Date;
      student: {
        id: string;
        name: string;
        indexnumber: string;
      };
    }[];
  };
  lect: lecturerWithInfo;
};

function Row({ row, lect }: rowType) {
  const [open, setOpen] = React.useState(false);
  let revalidate = useRevalidate();
  const fetcher = useFetcher();
  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset", border: "1px solid darkgray" },
        }}
      >
        <TableCell>
          <Button
            aria-label="expand row"
            sx={{ textTransform: "capitalize" }}
            variant="outlined"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? "Close" : "Open"}
          </Button>
        </TableCell>
        <TableCell component="th" scope="row">
          {lect?.name}
        </TableCell>
        <TableCell align="right">{row.code}</TableCell>
        <TableCell align="right">{row.session}</TableCell>
        <TableCell align="right">{row.group}</TableCell>
        <TableCell align="right">
          {format(new Date(row.createdAt), " p")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                // margin: 1,
                bgcolor: "background.paper",
                mb: 1,
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src="/itsa.jpg"
                    aria-label="logo"
                    alt="ItsaLogo"
                    sx={{ width: 90, height: 90 }}
                  >
                    R
                  </Avatar>
                }
                title={
                  <Typography variant="h6" sx={{ fontSize: 16 }}>
                    Attendance Sheet for {lect?.course?.code}{" "}
                    {toLowerCase(row.session)} Session
                  </Typography>
                }
                subheader={format(new Date(row.createdAt), "PPPP")}
              />
              <CardContent sx={{ borderTop: "1px solid lightgray" }}>
                <RealtimeTable attendance={row} />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    fetcher.submit(
                      { aId: row.id },
                      { method: "post", action: "/lecturer/dashboard" }
                    )
                  }
                >
                  Clear Entries
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  onClick={() => revalidate()}
                >
                  Refresh List
                </Button>
              </CardActions>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function AttendanceTable() {
  const data: lecturerWithInfo = useLoaderData();
  const rows = data?.course?.attendances;

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      //sx={{ border: "1px solid darkgray" }}
    >
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell> Course Lecturer</TableCell>
            <TableCell align="right">Verification Code</TableCell>
            <TableCell align="right">Session</TableCell>
            <TableCell align="right">Group</TableCell>
            <TableCell align="right">Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <Row key={row.id} row={row} lect={data} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
