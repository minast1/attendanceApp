import { Admin, Lecturer,Student,Session} from "@prisma/client";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/lib/session.server";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/lib/db.server";
import bcrypt from 'bcrypt'
import { createNewStudent, loginStudent } from "~/controllers/studentController";
import { serializeFormData } from '~/lib/constants';
import { loginLecturer, registerNewLecturer } from "~/controllers/lecturerController";



export const  authenticator = new Authenticator<Lecturer | StudentSessionId | Admin>(sessionStorage,
    { throwOnError: true });


type StudentSessionId = Pick<Student, "id">;


const loginAdmin = async (credentials:any) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = bcrypt.hashSync(credentials.password, salt);
    const admin = await db.admin.upsert({
        where: { email: credentials.email },
        update: {},
        create: {
            email: credentials.email, 
            password : hash
        }
    });
    
   return  admin
}


authenticator.use(
    new FormStrategy(async ({ form }) => {
        const formData: Omit<Student, "id" | "createdAt"> = serializeFormData(form);
        console.log(formData);
        const student = formData.name ?  await createNewStudent(formData) :  await loginStudent(formData.indexnumber)
        return  student 
    }),
    
    "student"
);

authenticator.use(
    new FormStrategy(async ({ form }) => {   
        let email = form.get("email") as string;
        let password = form.get("password")as string;
        let name = form.get("name")as string;
        let courseId = form.get("course")as string
        let session = form.get("session")as Session
        
        const lecturer = name ?
            await registerNewLecturer({ email, password, name, courseId, session }) : 
            await loginLecturer({email, password})
        return lecturer
    }),
    "lecturer"
);

authenticator.use(
    new FormStrategy(async ({ form }) => {
        let email = form.get("email");
        let password = form.get("password");
        let admin: Admin = await loginAdmin({ email, password })
        return admin
    }),
    "admin"
);






    