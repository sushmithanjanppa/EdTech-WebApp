const mongoCollections = require('../config/mongoCollection')
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const validate = require('../validation/userValidate');
const courses_func = require('./courses');
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
        validate.validateAge(age);``
        age = Number.parseInt(age);
        validate.validateUserType(userType);
        userType = Number.parseInt(userType); 

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
            tests:[]
        };

        const insertUser = await userCollection.insertOne(newUser);
        if(insertUser.insertedCount === 0) throw "Could not add the user";
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
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
        if (user === null) throw 'No such user found';
        return user;
    },

    async getUserById(id){
        validate.validateId(id)
        id = id.trim();
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: ObjectId(id)});
        if (user === null) throw 'No such user found';
        return user;
    },

    async enroll(email,course_name){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email});
  
        let course_info = await courses_func.getCourseByName(course_name)

        if(!course_info){
            throw "Course not found"
        }
        else{
        const found = user.courses.some(el => el._id.equals(course_info._id))
        if (!found){
            user.courses.push(course_info)
            let update = await userCollection.updateOne({email:email},[{$set:{courses : user.courses}}])
            if (update.modifiedCount === 0){
                throw "Couldnt Enroll"
            }
            else{
                // console.log({"Enrolled":true})
            }
        }
        else{
            throw "Already Enrolled"
        }
    }
        
    },
    async getprogress(email,course_name){
        email = email.trim();
        email = email.toLowerCase();

        const userCollection = await users()
        const coursedata = await courses_func.getCourseByName(course_name)

        let courseinfo = await userCollection.find({ email:email },{courses:{$elemMatch:{_id:coursedata._id} }, "courses.videos":1}).toArray();

        for(var i of courseinfo[0].courses){

            if(i._id.equals(coursedata._id)){

                var data = i.videos
            }
        }

        count = 0
        for(var i = 0; i < data.length; i++){
            if(data[i].done === true){
                count += 1
            }
        }
        var arr = []
        var obj = {}
        obj[course_name] = parseInt(count*100/data.length)
        arr.push(obj)
        return arr
    },

    async get_user_course_progress(email){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email},{$project:{courses:1}});

        var prog_data = []
        for (var i of user.courses){
            if (i.courseName){
                let prog = await this.getprogress(email,i.courseName)
                prog_data.push(prog)
            }
        }
        return prog_data
    },

    async get_user_courses(email){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        const userCollection = await users();
        const user = await userCollection.findOne({email: email},{$project:{courses:1}});
        return user
    },
    
    async editUserInfo(email, name, gender, age, userType){
        validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        
        var user = await this.getUser(email);

        if(!name || typeof(name)=='undefined'){
            newName = user.name
        }else{
            newName = name;
        }
        validate.validateName(newName);
        newName = newName.trim();

        if(!gender || typeof(gender)=='undefined'){
            newGender = user.gender
        }else{
            newGender = gender;
        }
        validate.validateGender(newGender);
        newGender = newGender.trim();
        
        if(!age || typeof(age)=='undefined'){
            newAge = user.age
        }else{
            newAge = age;
        }
        validate.validateAge(newAge);
        newAge = Number.parseInt(newAge);

        if(!userType || typeof(userType) == 'undefined'){
            newuserType = user.userType
        }else{
            newuserType = userType
        }
        newuserType = Number.parseInt(newuserType)
        validate.validateUserType(newuserType)

        const userCollection = await users();
       
        user.name = newName;
        user.age = newAge;
        user.gender = newGender;
        user.userType = newuserType;
        const updatedInfo = await userCollection.updateOne(
            { _id: user._id },
            { $set: user}
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update the user';
        }

        return {UserUpdated: true} ;
    },

    async score(email, score, course_name) {
    validate.validateEmail(email);
    email = email.trim();
    email = email.toLowerCase();
    const userCollection = await users();
    const user = await userCollection.findOne({ email: email });

    let course_info = await courses_func.getCourseByName(course_name)
    if (!course_info) {
        throw "Course not found"
    }
    else {
        const found = user.courses.some(el => el._id.equals(course_info._id))
     
        if (found) {
            user.tests.push([course_info.courseName,score])
            let update = await userCollection.updateOne({ email: email }, [{ $set: { tests:user.tests}}])
            if (update.modifiedCount === 0) {
                throw "Couldnt Send score"
            }
            else {
                // console.log({ "Score_sent": true })
            }
        }
        else {
            throw "Cannot send score, Course not found"
        }
    }
}

}

