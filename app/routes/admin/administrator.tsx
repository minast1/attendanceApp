/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import {
  Link,
  LoaderFunction,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "remix";
import CourseGrid from "~/src/components/admin/CourseGrid";
import { getCoursesWithLecturers } from "~/controllers/courseController";
import AdminLayout from "~/src/components/lecturers/AdminLayout";

export const loader: LoaderFunction = async () => {
  return getCoursesWithLecturers();
};

const AdminUserLayout = () => {
  const data = useLoaderData();

  let location = useLocation();
  let navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname != "/admin/administrator") {
      navigate("/admin/administrator", { replace: true });
    }
  }, []);

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Card sx={{ mb: 10 }}>
          <CardHeader
            title={
              <Box display="flex" alignItems="center">
                <Typography variant="h5" sx={{ mt: 2, mr: 1 }}>
                  Course Management Area
                </Typography>
                <img
                  style={{ height: 45, width: 40 }}
                  alt="attendance"
                  src="/graduation.png"
                />
              </Box>
            }
          />

          <CardContent sx={{ borderTop: "1px solid lightgray" }}>
            <CourseGrid data={data} />
            <Box>
              <Outlet />
            </Box>
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              size="small"
              component={Link}
              to="/admin/administrator/createcourse"
            >
              Create new Course
            </Button>
          </CardActions>
        </Card>
      </Container>
    </AdminLayout>
  );
};

export default AdminUserLayout;
