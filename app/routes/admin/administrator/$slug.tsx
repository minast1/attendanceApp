import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import CardHeader from "@mui/material/CardHeader";
import Snackbar from "@mui/material/Snackbar";
import {
  ValidatedForm,
  useIsSubmitting,
  validationError,
} from "remix-validated-form";
import {
  ActionFunction,
  json,
  LoaderFunction,
  useActionData,
  useLoaderData,
} from "remix";
import CircularProgress from "@mui/material/CircularProgress";
import { FormInputText } from "~/src/components/FormInputText";
import { FormInputDropdown } from "~/src/components/FormInputDropdown";
import { courseValidator } from "~/lib/constants";
import {
  getCourse,
  editCourse,
  deleteCourse,
} from "~/controllers/courseController";

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.slug;
  return getCourse(id as string);
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "DELETE") {
    const courseId = (await request.formData()).get("id");
    await deleteCourse(courseId as string);
    return null;
  }
  const data = await courseValidator.validate(await request.formData());
  if (data.error) return validationError(data.error);

  const res = await editCourse(data.data);
  return json(res);
};

export default function EditorDeleteCourse() {
  const data = useActionData();
  const course = useLoaderData();

  const isSubmitting = useIsSubmitting(course.id);

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
      //resetAfterSubmit={true}
      id={course.id}
      defaultValues={{
        id: course.id,
        name: course.name,
        code: course.code,
        level: course.level,
        semester: course.semester,
      }}
    >
      <Box sx={{ "& .MuiTextField-root": { m: 1 }, p: 4 }}>
        <CardHeader
          title="Edit Course"
          sx={{ borderBottom: "1px solid lightgray", py: 0, mb: 2 }}
        />

        <div>
          <FormInputText name="name" label="Course Name" />
          <FormInputText name="id" label="Id" styles={{ display: "none" }} />
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
              //sx={{ margin: theme.spacing(3, 0, 2),}}
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
                Course Edited Successfully
              </Alert>
            </Snackbar>
          </Box>
        </div>
      </Box>
    </ValidatedForm>
  );
}
