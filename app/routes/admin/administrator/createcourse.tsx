import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CardHeader from "@mui/material/CardHeader";
import { FormInputText } from "~/src/components/FormInputText";
import {
  ValidatedForm,
  useIsSubmitting,
  validationError,
} from "remix-validated-form";
import { FormInputDropdown } from "~/src/components/FormInputDropdown";
import { ActionFunction, json, useActionData } from "remix";
import CircularProgress from "@mui/material/CircularProgress";
import { addNewCourse } from "~/controllers/courseController";
import Snackbar from "@mui/material/Snackbar";
import { courseValidator } from "../../../lib/constants";
import { Alert } from "~/src/components/Alert";

export const action: ActionFunction = async ({ request }) => {
  const data = await courseValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);

  const res = await addNewCourse(data.data);
  return json(res);
};

export default function CreateCourse() {
  const isSubmitting = useIsSubmitting("newCourse");
  const data = useActionData();

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    data && setOpen(true);
  }, [data]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <ValidatedForm
      validator={courseValidator}
      method="post"
      resetAfterSubmit={true}
      id="newCourse"
      defaultValues={{
        name: "",
        code: "",
        level: "L100",
        semester: "FIRST",
      }}
    >
      <Box sx={{ "& .MuiTextField-root": { m: 1 }, p: 4 }}>
        <CardHeader
          title="Add New Course"
          sx={{ borderBottom: "1px solid lightgray", py: 0, mb: 2 }}
        />

        <div>
          <FormInputText name="name" label="Course Name" />
          <FormInputText
            name="code"
            label="Course Code"
            styles={{ width: "30%" }}
          />
          <FormInputDropdown
            name="level"
            label="Level"
            options={[
              { label: "100", value: "L100" },
              { label: "200", value: "L200" },
              { label: "300", value: "L300" },
              { label: "400", value: "L400" },
            ]}
            styles={{ mt: 1, ml: 3 }}
          />
          <FormInputDropdown
            name="semester"
            label="Semester"
            options={[
              { label: "First", value: "FIRST" },
              { label: "Second", value: "SECOND" },
            ]}
            styles={{ mt: 1, ml: 3 }}
          />
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              size="small"
            >
              {isSubmitting ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Submit"
              )}
            </Button>

            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                severity="success"
                sx={{ width: "100%" }}
                onClose={handleClose}
              >
                Course Created Successfully
              </Alert>
            </Snackbar>
          </Box>
        </div>
      </Box>
    </ValidatedForm>
  );
}
