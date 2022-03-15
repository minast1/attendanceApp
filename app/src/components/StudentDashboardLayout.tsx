/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountMenu from "~/src/components/AccountMenu";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import ProfileCard from "./students/ProfileCard";
import DashboardTable from "./DashboardTable";
import Divider from "@mui/material/Divider";
import { Link, useLoaderData, useTransition } from "remix";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import CourseSelector from "./students/CourseSelector";
import { useStudentStore } from "~/lib/store";
import { StudenType } from "~/controllers/courseController";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    //marginLeft: drawerWidth,
    //width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const toggled = useStudentStore((state) => state.courseSelectoToggle);
  const setToggled = useStudentStore((state) => state.setToggle);
  const data = useLoaderData<StudenType>();
  const transition = useTransition();
  const { student } = data;
  React.useEffect(() => {
    toggled && setToggled(false);
  }, [transition.state === "loading"]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar>
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          ></Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon fontSize="medium" />
            </Badge>
          </IconButton>
          <AccountMenu />
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          backgroundColor: "#cfd8dc",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />

        <Container component="main" maxWidth={false} sx={{ mt: 10, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <ProfileCard />
            </Grid>

            <Grid item container spacing={5} xs={12} sm={12} md={9} lg={9}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 6 }}>
                  <AlertTitle>{`Welcome ${student.name}`}</AlertTitle>
                  {student.courses.length > 0 ? (
                    <Box>
                      Toggle between <strong>Enter Attendance</strong> and{" "}
                      <strong>Edit Profile</strong> buttons to do so. Enter the
                      given attendance Pin and submit to authenticate your
                      attendance status for the course
                    </Box>
                  ) : (
                    <Stack>
                      <Box>
                        First things first. Select from the available options to
                        add registered courses. This would help us keep track of
                        attendances —{" "}
                        <strong>
                          Click on the Add Courses button to display the form
                          and submit to add registered courses
                        </strong>
                      </Box>

                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => setToggled(!toggled)}
                        sx={{ mt: 1, width: "20%" }}
                      >
                        Add Courses
                      </Button>
                    </Stack>
                  )}
                </Alert>
                {toggled && <CourseSelector />}
                {student.courses.length > 0 && <DashboardTable />}
              </Grid>
              <Grid item xs={12}>
                <Paper
                  component="div"
                  elevation={1}
                  sx={{
                    p: 2,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    //height: 300,
                    background: "white",
                    borderRadius: "6px",
                    fontSize: ".875rem",
                    wordWrap: "break-word",
                    border: 0,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      variant="contained"
                      component={Link}
                      sx={{ textTransform: "capitalize" }}
                      to="."
                    >
                      Enter Attendance
                    </Button>
                    <Button
                      size="small"
                      color="success"
                      variant="contained"
                      component={Link}
                      to="/students/profileEdit"
                      sx={{ ml: 2, textTransform: "capitalize" }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                  <Divider sx={{ mt: 1 }} />
                  <Box
                    sx={{
                      mt: 3,
                    }}
                  >
                    {children}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Container maxWidth={false} sx={{ mt: 5 }}></Container>
        </Container>
      </Box>
    </Box>
  );
}
