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
import { FormInputText } from "~/src/components/FormInputText";
import SubmitButton from "~/src/components/SubmitButton";
import { ValidatedForm } from "remix-validated-form";
import { lecturerSignInValidator } from "~/lib/constants";
import { authenticator } from "~/lib/auth.server";
import { commitSession, getSession } from "~/lib/session.server";
import FormHelperText from "@mui/material/FormHelperText";

const LecturerSignIn = () => {
  const { error } = useLoaderData();

  return (
    <Container component="main" maxWidth="xs" sx={{ pt: 10 }}>
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
          Sign in
        </Typography>
        <Box
          sx={{ width: "90%", mt: theme.spacing(1) }}
          method="post"
          // action='/api/auth/callback/credentials'
          id="lecturer_signin"
          validator={lecturerSignInValidator}
          component={ValidatedForm}
        >
          <FormInputText name="email" label="Email" />
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
          <SubmitButton title="SignIn" formId="lecturer_signin" />
          <Grid container>
            <Grid item xs>
              <Link to="." style={{ color: "blue", fontSize: 13 }}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                to="/lecturer/register"
                style={{ color: "blue", fontSize: 13 }}
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default LecturerSignIn;

export const loader: LoaderFunction = async ({ request }) => {
  let session: Session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);
  const data = json(
    { error },
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
    failureRedirect: "/lecturer",
  });
};
