import React from "react";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import theme from "~/src/theme";
import Box from "@mui/material/Box";
import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  Session,
  useLoaderData,
} from "remix";
import SubmitButton from "~/src/components/SubmitButton";
import { FormInputText } from "~/src/components/FormInputText";
import { ValidatedForm } from "remix-validated-form";
import { lecturerRegisterValidator } from "~/lib/constants";
import Divider from "@mui/material/Divider";
import { FormInputDropdown } from "~/src/components/FormInputDropdown";
import { getCoursesWithLecturers } from "~/controllers/courseController";
import { Course } from "@prisma/client";
import FormControl from "@mui/material/FormControl";
import { authenticator } from "~/lib/auth.server";
import { commitSession, getSession } from "~/lib/session.server";
import FormHelperText from "@mui/material/FormHelperText";

const LecturerSignUp = () => {
  const { courses, error } = useLoaderData();
  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 6 }}>
      <CssBaseline />
      <Paper
        sx={{
          //marginTop: theme.spacing(8),
          p: theme.spacing(3),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        elevation={5}
        square
      >
        <Avatar
          sx={{ margin: theme.spacing(1), width: 80, height: 80 }}
          alt="ItsaLogo"
          src="/itsa.jpg"
        />
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box
          sx={{ width: "90%", mt: theme.spacing(1) }}
          method="post"
          defaultValues={{
            session: "MORNING",
            course: "",
          }}
          id="lecturer_signup"
          validator={lecturerRegisterValidator}
          component={ValidatedForm}
        >
          <FormInputText name="name" label="User Name" />
          <FormInputText name="email" label="Email" styles={{ mt: 2 }} />
          {error && (
            <FormHelperText sx={{ color: "red" }}>
              {error.message}
            </FormHelperText>
          )}
          <FormInputText
            name="password"
            label="Password"
            type="password"
            styles={{ mt: 2 }}
          />
          <FormInputText
            name="confirm"
            label="Password Confirmation"
            type="password"
            styles={{ mt: 2, mb: 2 }}
          />

          <Typography variant="caption" sx={{ color: "blue" }}>
            Please Proivde Info About Your Affiliated Course
          </Typography>
          <Divider />
          <FormControl sx={{ mt: 2, flexGrow: 1, width: "100%" }}>
            <FormInputDropdown
              name="session"
              label="Session"
              options={[
                { label: "Morning", value: "MORNING" },
                { label: "Evening", value: "EVENING" },
                { label: "Weekend", value: "WEEKEND" },
              ]}
              styles={{ mb: 3 }}
            />
          </FormControl>
          <FormInputDropdown
            name="course"
            styles={{ width: "100%" }}
            label="Course"
            options={courses.map((course: Course) => {
              return { label: course.name, value: course.id };
            })}
          />
          <SubmitButton title="SignUp" formId="lecturer_signup" />
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link to="/lecturer" style={{ color: "blue", fontSize: 13 }}>
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LecturerSignUp;

export const loader: LoaderFunction = async ({ request }) => {
  let session: Session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);
  const data = json(
    { error, courses: await getCoursesWithLecturers() },
    {
      headers: {
        // only necessary with cookieSessionStorage
        "Set-Cookie": await commitSession(session),
      },
    }
  );
  return data;
};

export const action: ActionFunction = async ({ request, context }) => {
  await authenticator.authenticate("lecturer", request, {
    successRedirect: "/lecturer/dashboard",
    failureRedirect: "/lecturer/register",
  });
};
