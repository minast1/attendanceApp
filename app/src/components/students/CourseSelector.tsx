import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import { Form, useLoaderData, useTransition } from "remix";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useMediaQuery, useTheme } from "@mui/material";
import { Course } from "@prisma/client";

const CourseSelector = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const transition = useTransition();
  const [total, setTotal] = React.useState(0);
  const { courses } = useLoaderData();

  return (
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
        mb: 3,
      }}
    >
      <Box
        sx={{ display: "flex" }}
        component={Form}
        method="post"
        //reloadDocument
      >
        <FormControl
          sx={{ m: 3 }}
          component="fieldset"
          variant="standard"
          fullWidth
        >
          <FormGroup>
            {courses.map((course: Course) => (
              <FormControlLabel
                key={course.id}
                control={
                  <Checkbox
                    value={course.id}
                    name="courses"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      event.target.checked
                        ? setTotal(total + 1)
                        : setTotal(total - 1);
                    }}
                  />
                }
                label={`${course.name} - (${course.code})`}
              />
            ))}
          </FormGroup>
          {total < 4 && (
            <FormHelperText
              sx={{ color: "red", fontSize: 15, fontWeight: "bold" }}
            >
              * Please Select a minimum of 4 courses
            </FormHelperText>
          )}
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              fullWidth
              name="button"
              value="addCoursesToStudent"
              onClick={(event) => {
                if (total < 4) {
                  event.preventDefault();
                }
              }}
              variant="contained"
              color="primary"
              sx={{
                margin: theme.spacing(3, 0, 2),
                width: isMobile ? "60%" : "20%",
              }}
            >
              {transition.state === "submitting" ? "Submitting...." : "Submit"}
            </Button>
          </Box>
        </FormControl>
      </Box>
    </Paper>
  );
};

export default CourseSelector;
