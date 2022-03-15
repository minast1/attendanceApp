import { Student, Prisma, Session} from '@prisma/client';
import { db } from '~/lib/db.server';
//import { getSession } from '~/lib/session.server';
import { getYear } from "date-fns";



export const getStudentByIndexNumber = async (id: string) => {
    
    const student = await db.student.findFirst({
        where: { indexnumber: id }
    });
    if (!student) {
         return null 
    }
    return student;
}

export const createNewStudent = async (studentData: Omit<Student, "id" | "createdAt">) => {
    const studentExists = await db.student.findFirst({where: {indexnumber : studentData.indexnumber}})
    if (studentExists) {
        throw new Error("Index Number already exists")
    }
    
    const newStudent = await db.student.create({
        data: {
            ...studentData
        }
    });
    return newStudent
}

export const loginStudent = async (id: any) => {

    const student = await db.student.findFirst({
        where: { indexnumber: id }
    });
    if (!student) {
        throw new Error("Index Number is Invalid")
    }
    return student
};


export const addStudentCourses = async (ids: string[], Id:string) => {
    
    const courseIds = ids.map((id:string) => {
        return { id: id }
    })
    
            
         const user = await db.student.update({
        where: {
            id:  Id
        },
             data: {
            courses: {
                connect: [...courseIds]
            }
        },
      
         });
         
   return user

}

type Status = "High" | "Low" | "Regular";
export type Stats = Prisma.PromiseReturnType<typeof studentAttendanceStats>
export const studentAttendanceStats = async (Id:string, session: Session) => {

    const year = getYear(new Date());
  //find the course where lecturer id
    const lecutrerCourseAttendancesWithStudents = await db.lecturer.findFirst({ 
        where: { id: Id },
        include: {
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
                            students : true
                        }
                    }
                }
            }
        }
    })
      //Get only the attendances from  lecturerCoursesAttendanceWithStudents above
     const attendancesForCourseSession = lecutrerCourseAttendancesWithStudents?.course?.attendances
    
  const studentsOfferingCourse = await db.lecturer.findFirst({
      where: { id: Id }
  })
      .course().students({ where: { session: session } });
    
    const finalData =  studentsOfferingCourse.map((student) => {
        const totalLectsForStudentGroup: number = attendancesForCourseSession ? attendancesForCourseSession 
            .filter((a) => a.group === student.group).length : 0; 
        
        const studentGroupAttendances = attendancesForCourseSession?.filter((a) => a.group === student.group)
         
        const lectsAttd = studentGroupAttendances?.map((attd) => {
            const ifExists = attd.students.some((std) => std.studentId === student.id);
              return ifExists ? 1 : 0 ;
               })
             

        const lecturesAttendedByStudent =
            typeof lectsAttd === "undefined" ? 0 : lectsAttd.filter((atd) => atd === 1).length;

        const percentage = typeof totalLectsForStudentGroup !== "undefined"  &&   totalLectsForStudentGroup !== 0 ?
            lecturesAttendedByStudent / totalLectsForStudentGroup * 100 : 0 ;
         const status: Status =
      percentage < 30
        ? "Low"
        : percentage >= 30 && percentage <= 70
        ? "Regular"
        : "High";
        return {
           id: student.id,
      name: student.name,
      indexnumber: student.indexnumber,
            group: student.group,
      total: totalLectsForStudentGroup,
      attend: lecturesAttendedByStudent,
      percentage: percentage,
      status: status,
        }
    })
  //if (!result) throw new Error("Not Found ");

  return finalData;
}