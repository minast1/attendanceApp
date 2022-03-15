import { ActionFunction, LoaderFunction } from "remix";
import { getSession } from "~/lib/session.server";
import { db } from "~/lib/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth_session = await getSession(request.headers.get("cookie"));
  const date = new Date();
  const year = date.getFullYear();

  const user = auth_session.get("user");
  const { id, session } = user;
  // console.log(id);
  const result = await db.lecturer.findFirst({
    where: {
      id: id,
    },
    select: {
      course: {
        include: {
          attendances: {
            where: {
              year: {
                equals: year,
              },
              session: { equals: session },
            },
            include: {
              students: {
                select: {
                  student: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!result) throw new Error("Not Found ");

  return result;
};

const ConnectRoute = () => {
  return null;
};

export default ConnectRoute;

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("cookie"));
  const data = await request.formData();
  const code = data.get("code") as string;

  const user = session.get("user");
  const attendance = await db.attendance.findFirst({
    where: {
      code: code,
    },
  });
  if (!attendance) {
    throw new Error("dont exist");
  }
  const updateAttendanceStudents = await db.studentsInAttendances.create({
    data: {
      attendanceId: attendance.id,
      studentId: user.id,
      signedAt: new Date(),
    },
  });
  return updateAttendanceStudents;
};
