import React from "react";
import FormControl from "@mui/material/FormControl";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ActionFunction,
  Link,
  LoaderFunction,
  json,
  useLoaderData,
} from "remix";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Layout from "~/src/Layout";
import { ValidatedForm } from "remix-validated-form";
import { FormInputText } from "~/src/components/FormInputText";
import { FormInputDropdown } from "~/src/components/FormInputDropdown";
import { studentSignUpValidator } from "~/lib/constants";
import { authenticator } from "~/lib/auth.server";
import { getSession, commitSession } from "~/lib/session.server";
import Alert from "@mui/material/Alert";
import SubmitButton from "~/src/components/SubmitButton";
import { useMediaQuery, useTheme } from "@mui/material";

export default function Enroll() {
  const { error } = useLoaderData();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Layout>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: isMobile ? 0 : 15,
          }}
          elevation={0}
          square
        >
          {error && <Alert severity="error">{error.message}</Alert>}
          <Typography component="h1" variant="h5" sx={{ fontWeight: "bold" }}>
            Enroll
          </Typography>
          <Typography variant="caption" color="darkgray">
            Welome! Please fill in the required details to enroll
          </Typography>
          <ValidatedForm
            style={{ width: "100%", marginTop: 15 }}
            validator={studentSignUpValidator}
            //resetAfterSubmit={true}
            defaultValues={{
              name: "",
              indexnumber: "",
              session: "MORNING",
              level: "L100",
              group: "ONE",
            }}
            method="post"
            id="signUp"
          >
            <FormInputText
              name="name"
              label="Student Name"
              styles={{ mb: 3 }}
            />
            <FormInputText name="indexnumber" label="Index Number" />

            <FormControl sx={{ mt: 2, flexGrow: 1 }}>
              <FormInputDropdown
                name="level"
                label="Level"
                options={[
                  { label: "100", value: "L100" },
                  { label: "200", value: "L200" },
                  { label: "300", value: "L300" },
                  { label: "400", value: "L400" },
                ]}
                styles={{ mb: 3 }}
              />
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
              <FormInputDropdown
                name="group"
                label="Group"
                options={[
                  { label: "One", value: "ONE" },
                  { label: "Two", value: "TWO" },
                  { label: "Three", value: "THREE" },
                ]}
              />
            </FormControl>
            <SubmitButton title="Enroll" formId="signUp" />
            <Grid container>
              <Grid item sx={{ px: isMobile ? 1 : 4 }}>
                <Link to="/" style={{ color: "blue", fontSize: 13 }}>
                  {"Already have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </ValidatedForm>
        </Paper>
      </Container>
    </Layout>
  );
}

export const action: ActionFunction = async ({ request, context }) => {
  await authenticator.authenticate("student", request, {
    successRedirect: "/students",
    failureRedirect: "/register",
  });
};

export let loader: LoaderFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);
  return json(
    { error },
    {
      headers: {
        // only necessary with cookieSessionStorage
        "Set-Cookie": await commitSession(session),
      },
    }
  );
};
