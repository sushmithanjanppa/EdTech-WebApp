const mongoCollections = require('../config/mongoCollection')
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const validate = require('../validation/userValidate');
const courses_func = require('./courses');
const videos = require('../data/videos');
const courses = mongoCollections.courses


module.exports = {

    async createUser(name, email, password, gender, age, userType){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        validate.validatePassword(password);
        password = password.trim();
        validate.validateName(name);
        name = name.trim();
        validate.validateGender(gender);
        gender = gender.trim();
        validate.validateAge(age);
        age = Number(age);
        validate.validateUserType(userType);
        userType = Number(userType); 

        const userCollection = await users();
        const duplicateEmail = await userCollection.findOne({email: email});
        if(duplicateEmail !== null) throw "There is already a user with that email";
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newId = ObjectId();
        let newUser = {
            _id: newId,
            name: name,
            email: email,
            password: hashedPassword,
            gender: gender,
            age: age,
            userType: userType,
            courses: [],
        };

        const insertUser = await userCollection.insertOne(newUser);
        if(insertUser.insertedCount === 0) throw "Could not add email";
        return {userInserted : true};
    },

    async checkUser(email, password) {  
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        validate.validatePassword(password);
        password = password.trim();

        const userCollection = await users();
        const duplicateEmail = await userCollection.findOne({email: email});
        if(duplicateEmail == null) throw "Either the email or password is invalid";

        let passwordCompareToMatch = await bcrypt.compare(password, duplicateEmail.password);
        if(passwordCompareToMatch) {
            return {userExists : true}
        } else {
            throw "Either the email or password is invalid";
        } 
    },

    async getUser(email){
        // console.log('inside getuser, mail:',email)
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (user === null) throw 'No such user found';
        return user;
    },

    async enroll(email,course_name){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        // console.log(course_name)
        let course_info = await courses_func.getCourseByName(course_name)
        // console.log(course_info)
        if(!course_info){
            throw "Course not found"
        }
        else{
        const found = user.courses.some(el => el._id === course_info.course_id)
        if (!found){
            user.courses.push(course_info)
            let update = await userCollection.updateOne({email:email},[{$set:{courses : user.courses}}])
            if (update.modifiedCount === 0){
                throw "Couldnt Enroll"
            }
            else{
                console.log({"Enrolled":true})
            }
        }
        else{
            throw "Already Enrolled"
        }
    }
        
    },

    async get_user_course_progress(email){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email},{$project:{courses:1}});
        // console.log(user)
        var prog_data = []
        for (var i of user.courses){
            if (i.courseName){
                let prog = await videos.getprogress(email,i.courseName)
                prog_data.push(prog)
            }
        }
        return prog_data
    } 

}

async function main(){
    console.log(await module.exports.get_user_course_progress("pjhangl1@stevens.edu"))
}

// main();
