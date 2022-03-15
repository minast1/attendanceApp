import { Course, Level, Prisma, Semester} from "@prisma/client";
import { db } from "../lib/db.server";
import { getYear } from "date-fns";


export async function  getCoursesWithLecturers () {
    const data: Course[] = await db.course.findMany({
        orderBy : {id : 'desc'}
   });
    return data
}


export async function addNewCourse(formdata: Omit<Course, "id">) {
    const data: Course = await db.course.create({
        data: formdata
    });
    return data
}


export async function getCourse(id: string) {
    const data: Course | null = await db.course.findFirst({
        where: {
            id : id
        }
    })
    if (!data) {
        throw new Response("Not Found", {
            status:404
        })
    }
    return data 
}
type optionalId = {
    id?: string
    name: string
    code: string
    level: Level
    semester: Semester
}
export async function editCourse(formData: optionalId) {
    const data = await db.course.update({
        where: {
            id: formData.id
        },
        data: {
            name: formData.name,
            code: formData.code,
            semester: formData.semester,
            level: formData.level
        }
    });
    return data
}

export async function deleteCourse(Id: string) {
    return  await db.course.delete({
        where: {
            id: Id
        }
    })
}

type Status = "High" | "Very Low" | "Regular";
export async function getCoursesByLevel(session:any) {
     //const session = await getSession(request.headers.get("cookie"));
    const year = getYear(new Date());
    
    const student = await db.student.findFirst({
        where: { id: session.id },
        include: {
            courses: {
                include: {
                    lecturers: {
                        where: {
                            session: session.session
                        }
                    }, attendances: {
                        where: {
                            session: { equals: session.session },
                            group: { equals: session.group },
                            year: { equals: year }
                        },
                        include: {
                            students: true
                        }
                    }
                }
            }
        }
    });
    if (!student) {
        throw new Response("Not Found", {
            status:404
        })
    }
    const courses = await db.course.findMany({
        where: {
            level: student?.level,
        },
        
    })

    const courseData = student.courses.map((course) => {
        const lecsConducted = course.attendances.length; //can be 0 or more 

        const lAttended = course.attendances.map((attendance) => {
            let ifExists = attendance.students.some((astd) => astd.studentId === student.id);
            return ifExists ? 1 : 0
        });
        const lecturesAttended = lAttended.filter((a) => a === 1).length;

        const percentage = lecsConducted !== 0 ?
            lecturesAttended / lecsConducted * 100 : 0;
        
        return {
            id: course.id,
            name: course.name,
            lecturer: course.lecturers.find((lec) => student.session === lec.session)?.name,
            attended: lecturesAttended,
            conducted: lecsConducted,
            percentage: percentage,
        }
    });

      //Total lecturers attended divided by total lectures conducted
    const totalConductedLectures: number = courseData.map((courseInfo) => courseInfo.conducted)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    
    const totalAttendedLectures: number = courseData.map((courseInfo) => courseInfo.attended)
         .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
 
    const studentAttendanceStatus = totalConductedLectures != 0 ? totalAttendedLectures / totalConductedLectures *100 : 0
     // console.log(studentAttendanceStatus)
     const status:Status = studentAttendanceStatus < 30
        ? "Very Low"
        : (studentAttendanceStatus >= 30) && (studentAttendanceStatus <= 70)
        ? "Regular"
             : "High";
    
    return { courses , courseData, student , status};
};
     
  export  type StudenType = Prisma.PromiseReturnType<typeof getCoursesByLevel>
 