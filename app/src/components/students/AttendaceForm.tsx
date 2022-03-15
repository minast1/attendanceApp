import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import { ValidatedForm } from "remix-validated-form";
import { FormInputText } from "../FormInputText";
import SubmitButton from "../SubmitButton";
import { studentAttendanceValidator } from "~/lib/constants";
import { useMediaQuery, useTheme } from "@mui/material";
import toast, { Toaster } from "react-hot-toast";
import { Alert } from "~/src/components/Alert";
import { useActionData } from "remix";

export default function AttendanceForm() {
  const data = useActionData();

  React.useEffect(() => {
    data &&
      !data?.fieldErrors &&
      toast.custom(<Alert severity="success">Successfully Signed In</Alert>, {
        position: "bottom-right",
      });
  }, [data]);
  //console.log(data);
  const theme = useTheme();
  const mobileScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      component={ValidatedForm}
      validator={studentAttendanceValidator}
      resetAfterSubmit
      id="attendance_code"
      method="post"
      sx={{ display: "flex", alignItems: "center" }}
      defaultValues={{
        code: "",
      }}
      //onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl fullWidth>
        <FormInputText
          name="code"
          label="Attendance Code"
          styles={{ width: mobileScreen ? "70%" : "50%" }}
        />

        <SubmitButton
          title="Sign In"
          formId="attendance_code"
          styles={{ width: "30%", textTransform: "capitalize" }}
        />
      </FormControl>

      <Toaster containerStyle={{ marginTop: 5 }} />
    </Box>
  );
}
