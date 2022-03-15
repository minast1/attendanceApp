import { Group, Level, Session} from "@prisma/client";
import { db } from "../app/lib/db.server";
//const { faker } = require('@faker-js/faker');
import  faker from '@faker-js/faker';
import { courses, Courses } from "../app/lib/courses.server";


 const session: Session[] = ["MORNING", "EVENING", "WEEKEND"]
    const level: Level[] = ["L100", "L200", "L300", "L400"]
    const group: Group[] = ["ONE", "THREE", "FOUR", "TWO"]



const fakerAdmin = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(),
})

/*const fakerStudent = () => ({
    name: faker.fake('{{name.firstName}} {{name.lastName}}'),
    indexnumber: Math.floor(10000000 + Math.random() * 90000000),
    group: faker.helpers.randomize(group),
    level: faker.helpers.randomize(level),
    session: faker.helpers.randomize(session)
})*/



async function seed() {
    const totalStudents = 100;
    const totalLecturers = 60;
    const totalAdmins = 4;
    

    //Create and get the course ids 
     
    const courseIds: string[] = await Promise.all(courses.map(async(item: Courses) => {
        const course = await db.course.create({
            data: { ...item },
           // select: { id: true }
        });
        return course.id

    }))
    /// Create lecturers and assign random courses to them 
    for (let index = 0; index < totalLecturers; index++) {
        await db.lecturer.create({
            data: {
                email: faker.internet.email(),
                name: faker.fake('{{name.prefix}}, {{name.firstName}} {{name.lastName}}'),
                password: faker.internet.password(),
                session: faker.helpers.randomize(session),
                courseId: faker.helpers.randomize(courseIds)
            }
        })
        
    }

    //Create Admins
    for (let index = 0; index < totalAdmins; index++) {
        await db.admin.create({
            data: fakerAdmin()
        })
        
    }

    //Create Students
    for (let index = 0; index < totalStudents; index++) {
        await db.student.create({
            data: {
                name: faker.fake('{{name.firstName}} {{name.lastName}}'),
                indexnumber: Math.floor(10000000 + Math.random() * 90000000).toString(),
                group: faker.helpers.randomize(group),
                level: faker.helpers.randomize(level),
                session: faker.helpers.randomize(session),
            }
        
        })
    
    
    }
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
})