const mongoCollections = require('../config/mongoCollection')
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 14;
const validate = require('../validation/userValidate');


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
            return {userInserted : true}
        } else {
            throw "Either the email or password is invalid";
        } 
    },

    async getUser(id){
        validate.validateId(id);
        id = id.trim();

        const userCollection = await users();
        const user = await userCollection.findOne({ _id: id});
        if (user === null) throw `no user with id: ${id} found`;
        return user;
    },


}