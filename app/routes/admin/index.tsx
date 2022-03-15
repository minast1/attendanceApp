import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AttendanceForm from "~/src/components/lecturers/AttendanceForm";
//import RealtimeTable from "~/src/components/lecturers/RealtimeTable";
import StudentsTable from "~/src/components/lecturers/StudentsTable";
import { LoaderFunction } from "remix";
import AdminLayout from "~/src/components/lecturers/AdminLayout";

export const loader: LoaderFunction = ({ request }) => {
  return null;
};

const LecturerDashboard = () => {
  //const data = useLoaderData();
  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
        <Card sx={{ mb: 10 }}>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <Typography variant="h5" sx={{ mt: 2, mr: 1 }}>
                  Student Attendance Statistics
                </Typography>
                <img
                  style={{ height: 40, width: 40 }}
                  alt="attendance"
                  src="/attendance.png"
                />
              </Box>
            }
            subheader="Lectures Conducted 67"
          />

          <CardContent sx={{ borderTop: "1px solid lightgray" }}>
            <StudentsTable />
          </CardContent>
          <CardActions disableSpacing></CardActions>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <AttendanceForm />
          </Grid>

          <Grid item xs={12} md={6} lg={6}></Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default LecturerDashboard;
