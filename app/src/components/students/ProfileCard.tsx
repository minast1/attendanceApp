import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { useLoaderData } from "remix";
import { toLowerCase } from "~/lib/constants";
import { StudenType } from "~/controllers/courseController";
import Avatar from "@mui/material/Avatar";

export default function ProfileCard() {
  const { student, status } = useLoaderData<StudenType>();

  return (
    <>
      <Paper
        component="div"
        elevation={7}
        sx={{
          p: 2,
          //position: "relative",
          display: "flex",
          flexDirection: "column",
          height: 360,
          background: "white",
          borderRadius: "20px",
          fontSize: ".875rem",
          wordWrap: "break-word",
          border: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: 10,
          }}
        >
          <Avatar
            sx={{ height: 130, width: 130 }}
            src="/itsa.jpg"
            alt="ItsaLogo"
          />
          <Box
            sx={{
              pl: 2,
              fontSize: 22,
              fontWeight: "bold",
              color: "#212121",
              textTransform: "capitalize",
            }}
          >
            {student?.name}
          </Box>
          <Divider sx={{ width: "100%" }} variant="middle" />
          <Stack
            spacing={0}
            justifyContent="flex-start"
            direction="column"
            alignItems="flex-start"
          >
            <Box display="flex" sx={{ mt: 2 }} alignItems="center">
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  pr: 2,
                }}
              >
                {" "}
                Student Id:{" "}
              </Typography>
              <Typography
                sx={{ fontSize: 15, fontWeight: "bold", color: "#757575" }}
              >
                {student?.indexnumber}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  pr: 2,
                }}
              >
                {" "}
                Session:{" "}
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: "bold",
                  textTransform: "capitalize",
                  color: "#757575",
                }}
              >
                {`${toLowerCase(student?.session)} Session`}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  pr: 2,
                }}
              >
                {" "}
                Level:{" "}
              </Typography>
              <Typography
                sx={{ fontSize: 15, fontWeight: "bold", color: "#757575" }}
              >
                {student?.level}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  pr: 2,
                }}
              >
                {" "}
                Group:{" "}
              </Typography>
              <Typography
                sx={{ fontSize: 15, fontWeight: "bold", color: "#757575" }}
              >
                Group{" "}
                <span style={{ textTransform: "capitalize", color: "#757575" }}>
                  {toLowerCase(student?.group)}
                </span>
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: "bold",
                  pr: 2,
                }}
              >
                {" "}
                Attendance Status:{" "}
              </Typography>
              <Chip
                label={status}
                color={
                  status === "Very Low"
                    ? "error"
                    : status === "High"
                    ? "success"
                    : "info"
                }
                size="small"
              />
            </Box>
          </Stack>
        </div>
      </Paper>
    </>
  );
}
