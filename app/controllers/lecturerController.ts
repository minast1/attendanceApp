import { Lecturer, Prisma, Session } from '@prisma/client';
import bcrypt from 'bcrypt'
import { db } from '~/lib/db.server';
import startOfDay from "date-fns/startOfDay";
import { endOfDay } from "date-fns";

type Credentials = {
    email: string
    password: string
}


export const loginLecturer = async (credentials: Credentials) => {
    
    const lecturer = await db.lecturer.findFirst({
        where: { email: credentials.email },
         include: {
            course: {
                include: {
                    students: true,
                    attendances: {
                        where: {
                            createdAt : new Date()
                        },
                        include: {
                            students : true 
                        }
                    }
                }
            }
        }
    });

    if (!lecturer) {
        throw new Error("Invalid Credentials")
    }
    const crosscheckPassword = await bcrypt.compareSync(credentials.password, lecturer.password);

    if (crosscheckPassword) {
        const { password, ...rest } = lecturer;
        return rest
    } else {
        throw new Error("Password is Invalid")
    }
};



export const getLecturerWithEmail = async (email: string) => {
    return await db.lecturer.findFirst({
        where: { email: email }
    });
    
}

type lecturerFormData =  Omit<Lecturer, "id" | "createdAt">
export const registerNewLecturer =async (formData: lecturerFormData) => {
       const emailExists = await getLecturerWithEmail(formData.email)
    if (emailExists) {
        throw new Error("This email already exists")
    }
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = bcrypt.hashSync(formData.password, salt);
    const newLecturer = await db.lecturer.create({
        data: {
            name: formData.name,
            email: formData.email,
            session: formData.session,
            password: hash,
            courseId: formData.courseId

        }, include: {
            course: {
                include: {
                    students: true,
                    attendances: {
                        where: {
                            createdAt : new Date()
                        },
                        include: {
                            students : true 
                        }
                    }
                }
            }
        }
    });
    const { password, ...rest } = newLecturer;
    return rest
}

export type lecturerSessionData = Prisma.PromiseReturnType<typeof registerNewLecturer>

export const getLecturerWithInfo = async (Id: string, session:Session) => {
     
    const start = startOfDay(new Date());
     const end = endOfDay(new Date())

     const lecturer = await db.lecturer.findFirst({
    where: {
      id: Id,
    },
    include: {
      course: {
        include: {
          students: true,
          attendances: {
            where: {
              createdAt: {
                gte: start,
                lt: end,
              },
              session: { equals: session },
            },
            include: {
              students: {
                select: {
                  student: {
                    select: { id: true, indexnumber: true, name: true },
                  },
                  signedAt: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return lecturer;
}

export type lecturerWithInfo = Prisma.PromiseReturnType<typeof getLecturerWithInfo>
