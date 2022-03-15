import * as React from "react";
import { Outlet, json } from "remix";
import StudentDashboardLayout from "~/src/components/StudentDashboardLayout";
import { ActionFunction, LoaderFunction } from "remix";
import { authenticator } from "~/lib/auth.server";
import { getCoursesByLevel } from "~/controllers/courseController";
import { addStudentCourses } from "~/controllers/studentController";
import { Student } from "@prisma/client";
import { getSession } from "~/lib/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  // If the user is already authenticated redirect to /dashboard directl
  const session = (await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  })) as Student;

  const data = await getCoursesByLevel(session);
  return json({ ...data });
};

export default function StudentRoute() {
  return (
    <StudentDashboardLayout>
      <Outlet />
    </StudentDashboardLayout>
  );
}
export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("cookie"));
  const user = await session.get("user");
  let formData = await request.formData();

  let data = formData.getAll("courses") as string[];

  return await addStudentCourses(data, user.id);
};
