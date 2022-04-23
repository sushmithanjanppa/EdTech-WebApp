const express = require('express');
const router = express.Router();
const data = require('../data');
const mongoCollections = require('../config/mongoCollections')
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const emailValidate = require('email-validator')
const saltRounds = 16;


module.exports = {

    async createUser(name, email, password) {

        if(!name) throw "Please enter a valid input for name";

        if(!email) throw "Please enter a valid input for email";

        if(!password) throw "Please enter a valid input for password";

        if(typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') throw 'You must provide string values in the inputs of name, email and password.';

        if(name.trim().length == 0 ||email.trim().length == 0 || password.trim().length == 0) throw "Do not enter blank spaces for name, email and password."

        // if(email.trim().replace(/\s/g, "").length < 4) throw "Enter email with length of more than 4 characters."


        if (password.length < 6) throw "The minimum length of password should be atleast 6.";
        
        
        if (!emailValidate.validate(email)) throw "The email should be valid";

        let passValidate = /^(?!.* ).{6,20}$/gi;
        if (!password.match(passValidate)) throw "The password should be valid and should only contain any other character including special characters";

        const userCollection = await users();
        const duplicateEmail = await userCollection.findOne({email: email});

        if(duplicateEmail !== null) throw {statusCode: 400, message: "There is already a user with that email"}

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let newEmail = {
            name: name,
            email: email,
            password: hashedPassword
        };

        const insertUser = await userCollection.insertOne(newEmail);
        if(insertUser.insertedCount === 0) throw "Could not add email";

        return {userInserted : true};

    },



    async checkUser(name, email, password) {

        if(!name) throw "Please enter a valid input for name";

        if(!email) throw "Please enter a valid input for email";

        if(!password) throw "Please enter a valid input for password";

        if(typeof name !== 'string' ||typeof email !== 'string' || typeof password !== 'string') throw "You must provide string values in the inputs of name, email and password.";

        if(name.trim().length == 0 ||email.trim().length == 0 || password.trim().length == 0) throw "Do not enter blank spaces for name, email and password."

        // if(username.trim().replace(/\s/g, "").length < 4) throw "Enter username with length of more than 4 characters."

        if (password.length < 6) throw "The minimum length of password should be atleast 6.";
        
        if (!emailValidate.validate(email)) throw "The email should be valid";

        let passValidate = /^(?!.* ).{6,20}$/gi;
        if (!password.match(passValidate)) throw "The password should be valid and should only contain any other character including special characters";

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


}