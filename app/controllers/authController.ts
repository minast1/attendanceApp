/* eslint-disable @typescript-eslint/no-unused-vars */
import { Admin, Lecturer,Student,Session } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/lib/session.server";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/lib/db.server";
import bcrypt from 'bcrypt'



export let studentAuthenticator = new Authenticator<Student>(sessionStorage, { throwOnError : true});

export let adminAuthenticator = new Authenticator<Admin>(sessionStorage, { throwOnError : true});

export let lecturerAuthenticator = new Authenticator<Lecturer>(sessionStorage, { throwOnError : true});



const loginStudent = async (id: any) => {
    const student = await db.student.findFirst({
        where: { indexnumber: id }
    });
    if (!student) {
        throw new Response("Invalid Credentials", {
            status:404
        })
    }
    return student
}

type Credentials = {
    email: any
    password: any
}
const loginAdmin = async (credentials:Credentials) => {
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

const loginLecturer = async (credentials:Credentials) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = bcrypt.hashSync(credentials.password, salt);
    const lecturer = await db.lecturer.findFirst({
        where: { email: credentials.email },
    });

     if (!lecturer) {
        throw new Response("Invalid Credentials", {
            status:404
        })
    }
    const crosscheckPassword = await bcrypt.compareSync(credentials.password, lecturer.password)
            if(crosscheckPassword) {
            return lecturer
           }  else { 
           throw new Response("Password is Invalid", {status: 404})
           
          }
            
}


studentAuthenticator.use(
    new FormStrategy(async ({ form }) => {
        let indexnumber = form.get("indexnumber") 
        let student: Student = await loginStudent(indexnumber);
        return student
    })
)

lecturerAuthenticator.use(
    new FormStrategy(async ({ form }) => {
        let email = form.get("email");
        let password = form.get("password");
        let lecturer: Lecturer = await loginLecturer({ email, password })
        return lecturer 
    })
)

    