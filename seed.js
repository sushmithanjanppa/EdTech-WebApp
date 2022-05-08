const dbConnection = require('./config/mongoConnection');
const users = require('./data/users')
const course = require('./data/courses');
const video = require('./data/videos');
const questions = require('./data/questions');

async function main() {
    const db = await dbConnection.connectToDb();
    await db.dropDatabase();

    try{
        console.log(await users.createUser("Mavniner", "mav@gmail.com", "password", "Man", 23, 0));
        console.log(await users.createUser("Achal Shah", "ach@gmail.com", "password123", "Man", 22, 1));
        console.log(await users.createUser("Preet Jhanglani", "preet@gmail.com", "123@456", "Man", 23, 1));
        console.log(await users.createUser("Sushmitha Anjanappa", "sush@gmail.com", "Pass12@#r", "Woman", 23, 1));
        console.log(await users.createUser("Patrick Hill", "phill@gmail.com", "Phill@123", "Man", 40, 1));
    }catch(e){
        console.log(e);
    }

    try{
        let data = {
            courseName: "Web Development",
            description: "This course provides an introduction to web development and client-side scripting. After providing a review of HTML5 and CSS, the course provides exposer to the concepts of web programming using client side scripting.",
            image: "https://www.onlinecoursereport.com/wp-content/uploads/2020/07/shutterstock_394793860-1024x784.jpg",
            video_id: 'ysEN5RaKOlA',
            branch : "CS",
            email:"phill@gmail.com"
        }
        // console.log(await module.exports.addCourse(data.courseName,data.description,data.image,data.video_id,data.branch,data.email))
        const c1 = await course.addCourse(data.courseName,data.description,data.image,data.video_id,data.branch,data.email)
        data = {
            courseName: "Python",
            description: "This course includes an overview of the various tools available for writing and running Python, and gets students coding quickly.",
            image: "https://content.techgig.com/thumb/msid-79386213,width-1200,height-900,resizemode-4/79386213.jpg",
            video_id: ['kqtD5dpn9C8',"VchuKL44s6E"],
            branch : "CS",
            email:"preet@gmail.com"
        }
        const c2 = await course.addCourse(data.courseName,data.description,data.image,data.video_id,data.branch,data.email)
        data = {
            courseName: "Graphic Design",
            description: "The Graphic Designer job description includes the entire process of defining requirements, visualizing and creating graphics including illustrations, logos, layouts and photos.",
            image: "https://www.pixelo.net/wp-content/uploads/2018/10/1934823-e1540532501723.jpg",
            video_id: ['9QTCvayLhCA',"k0EyAs9Q4NI"],
            branch : "NONCS",
            email:"sush@gmail.com"
        }
        const c3 = await course.addCourse(data.courseName,data.description,data.image,data.video_id,data.branch,data.email)
        // const c4 = await course.addCourse("Demo 4","demo course 4 description")
    }catch(e){
        console.log(e);
    }

    try{
        let course_data = await course.getCourseByName('Web Development')
        let course_id = course_data._id.toString()
        let quest = {
            course_id:course_id,
            question:'Which character entity would you use to display extra spaces on a webpage?',
            ans1:"& gt",
            ans2:"& nbsp",
            ans3:"& reg",
            ans4:"& lt",
            secid:"section1",
            ans: "& nbsp"
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);
        
        quest = {
            course_id:course_id,
            question:'What does HTML stand for?',
            ans1:"Hyper Text Meta Language",
            ans2:"Hyper Text Markup Language",
            ans3:"Hyper Time Meta Language",
            ans4:"Hyper Time Markup Language",
            secid:"section2",
            ans: "Hyper Text Markup Language"
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);

        quest = {
            course_id:course_id,
            question:'What file extension should HTML files have?',
            ans1:".html",
            ans2:".ht",
            ans3:".page",
            ans4:".php",
            secid:"section3",
            ans: ".html"
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);

        quest = {
            course_id:course_id,
            question: 'Which tag is the root tag in HTML?',
            ans1:"<body>",
            ans2:"<html>",
            ans3:"<title>",
            ans4:"<head>",
            secid:"section4",
            ans: "<html>"
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);
    }
    catch(e){
        console.log(e)
    }

    try{
        let course_data = await course.getCourseByName('Python')
        let course_id = course_data._id.toString()
        quest = {
            course_id:course_id,
            question:'What is output for min(hello world)',
            ans1:"e",
            ans2:"A blank space character",
            ans3:"w",
            ans4:"None of the above",
            secid:"section1",
            ans: "A blank space character "
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);

        quest = {
            course_id:course_id,
            question:'Which of the following is false statement in python',
            ans1:"int(144)==144",
            ans2:"int('144')==144",
            ans3:" int(144.0)==144",
            ans4:"None of the above",
            secid:"section2",
            ans: "None of the above"
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);

        quest = {
            course_id:course_id,
            question:"What is output for raining.find('z') ?",
            ans1:" Type error",
            ans2:"Null",
            ans3:"-1",
            ans4:"Not Found",
            secid:"section3",
            ans: "-1"
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);

        quest = {
            course_id:course_id,
            question:' What will be the output of the following code?(print(type(1/2)))',
            ans1:" <class 'float'>",
            ans2:" <class 'int'> ",
            ans3:" NameError: '1/2' is not defined.",
            ans4:"0.5",
            secid:"section4",
            ans: " <class 'float'>", 
        }
        await questions.create(quest.course_id,quest.question,quest.ans1,quest.ans2,quest.ans3,quest.ans4,quest.secid,quest.ans);
    }
    catch(e){
        console.log(e)
    }

    await dbConnection.closeConnection();
}

main() 