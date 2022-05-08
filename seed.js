const dbConnection = require('./config/mongoConnection');
const users = require('./data/users')
const course = require('./data/courses');
const video = require('./data/videos');

async function main() {
    const db = await dbConnection.connectToDb();
    // await db.dropDatabase();

    // try{
    //     const c1 = await course.addCourse()
    //     // const c2 = await course.addCourse("Demo 2","demo course 2 description")
    //     // const c3 = await course.addCourse("Demo 3","demo course 3 description")
    //     // const c4 = await course.addCourse("Demo 4","demo course 4 description")
    // }catch(e){
    //     console.log(e);
    // }

    // try{
    //     console.log(await video.createVideo('Demo Video', 'DstrDhlgSg4', 'C1'))
    //     // console.log(await video.createVideo('First Video', '3JluqTojuME', 'Demo 1'))
    //     // console.log(await video.createVideo('Second Video', 'Q33KBiDriJY', 'Demo 3'))
    //     // console.log(await video.createVideo('fourth Video', 'fqdidduTuZM', 'Demo 1'))
    // }catch(e){
    //     console.log(e)
    // }

    // try{
    //     console.log(await users.createUser("mavniner", "mav@gmail.com", "password", "Man", 23, 0));
    //     console.log(await users.createUser("achal", "ach@gmail.com", "password123", "other", 24, 0));
    //     console.log(await users.createUser("preet", "preet@gmail.com", "123@456", "Transgender", 24, 1));
    //     console.log(await users.createUser("sushmita", "sush@gmail.com", "Pass12@#r", "Woman", 23, 0));
    // }catch(e){
    //     console.log(e);
    // }

    await dbConnection.closeConnection();
 }

main() 