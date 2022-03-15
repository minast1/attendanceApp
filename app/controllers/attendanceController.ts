import { db } from "~/lib/db.server";
import { Group, Lecturer,Course, Prisma } from "@prisma/client";
import cuid from 'cuid';

type LectureWithCourse =  Lecturer  & {course : Course}
type funcType = {
    user: LectureWithCourse
    group: Group
    date: string
}


export async function createAttendanceSheet(formData: funcType) {
    const date = new Date(formData.date);
    const year = date.getFullYear()
    const level = formData.user.course.level ;
    const session = formData.user.session;
    const group = formData.group;
    const courseId = formData.user.course.id 
    const id = cuid()
    const code = id.slice(-8);
    const sheet = await db.attendance.create({
        data: {
            level: level,
            session: session,
            group: group,
            courseId: courseId,
            code: code,
            year: year
        },
        include: {
            students: {
                include: {
                    student : true
                }
            }
        }
       
    });
  
    return sheet;
}

export const validateStudentAttendance = async (code : string, Id:string) => {
    const attendance = await db.attendance.findFirst({
        where: {
            code: code
        }
    });
    if (attendance) {
          await db.studentsInAttendances.create({
             data: {
                 attendanceId: attendance.id,
                 studentId: Id,
                 signedAt : new Date()
         }
    })
    }
   
}

export type AtttendanceType = Prisma.PromiseReturnType<typeof createAttendanceSheet>

export const deleteAllStudentsFromAttendance = async (aId:string) => {
     await db.studentsInAttendances.deleteMany({
        where: {
            attendanceId: { equals: aId }
          }
      })
}