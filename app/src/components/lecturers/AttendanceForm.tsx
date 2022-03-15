import React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useLoaderData } from "remix";
import { lecturerWithInfo } from "~/controllers/lecturerController";
import Typography from "@mui/material/Typography";
import { FormInputDropdown } from "../FormInputDropdown";
import { ValidatedForm } from "remix-validated-form";
import { FormInputDate } from "../FormInputDate";
import { lecturerAttendanceValidator, toLowerCase } from "~/lib/constants";
import SubmitButton from "../SubmitButton";
import AttendanceTable from "./AttendanceTable";
//import { useMediaQuery, useTheme } from "@mui/material";

const AttendanceForm = () => {
  const lecturer: lecturerWithInfo = useLoaderData();

  return (
    <Card>
      <CardHeader
        subheader={
          <Typography sx={{ fontSize: 17 }}>
            {`New Attendance for ${lecturer?.course?.code} ${toLowerCase(
              lecturer?.session as string
            )} Session`}
          </Typography>
        }
      />

      <CardContent sx={{ borderTop: "1px solid lightgray" }}>
        <Box
          component={ValidatedForm}
          validator={lecturerAttendanceValidator}
          id="attendance"
          defaultValues={{ group: "ONE" }}
          sx={{
            "& .MuiTextField-root": { m: 1, width: "30ch" },
          }}
          method="post"
        >
          <div>
            <FormInputDropdown
              name="group"
              label="Group"
              options={[
                { label: "One", value: "ONE" },
                { label: "Two", value: "TWO" },
                { label: "Three", value: "THREE" },
              ]}
              styles={{ mb: 3 }}
            />

            <FormInputDate name="date" label="Attendance Date" />

            <Divider />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <SubmitButton
                title="Submit"
                formId="attendance"
                styles={{ width: "10%", textTransform: "capitalize" }}
              />
            </Box>
          </div>
        </Box>

        <AttendanceTable />
      </CardContent>
    </Card>
  );
};

export default AttendanceForm;
