import React from "react";
import AttendanceForm from "~/src/components/students/AttendaceForm";
import { ActionFunction, json, LoaderFunction, Session } from "remix";
import { validationError } from "remix-validated-form";
import { getSession } from "~/lib/session.server";
import { studentAttendanceValidator } from "~/lib/constants";
import { db } from "~/lib/db.server";

export default function Attendance() {
  return (
    <React.Fragment>
      <AttendanceForm />
    </React.Fragment>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  let session: Session = await getSession(request.headers.get("cookie"));

  return json({ session });
};

export const action: ActionFunction = async ({ request }) => {
  let session: Session = await getSession(request.headers.get("cookie"));
  const result = await studentAttendanceValidator.validate(
    await request.formData()
  );

  //If the auth code is valid
  //send find attendance where auth code === code and connect the user to it
  //return the attendance
  if (result.error) return validationError(result.error);
  const { code } = result.data;
  const user = session.get("user");
  const attendance = await db.attendance.findFirst({
    where: {
      code: code,
    },
  });
  if (!attendance) {
    return validationError(
      {
        fieldErrors: {
          code: "The attendance code is Invalid!",
        },
        formId: result.formId,
      },
      result.data
    );
  }

  const updateAttendanceStudents = await db.studentsInAttendances.create({
    data: {
      attendanceId: attendance.id,
      studentId: user.id,
      signedAt: new Date(),
    },
  });
  return updateAttendanceStudents;

  // throw new Error("Attendance does not exist")
};
