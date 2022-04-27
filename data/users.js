const express = require('express');
const router = express.Router();
const data = require('../data');
const mongoCollections = require('../config/mongoCollection')
const users = mongoCollections.users;
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;
const validate = require('./validate')


module.exports = {

    async createUser(name, email, password) {

        validate.validateUserEmailPasswordName(name, email, password)

        const userCollection = await users();
        const duplicateEmail = await userCollection.findOne({email: email});

        if(duplicateEmail !== null) throw "There is already a user with that email"

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



    async checkUser(email, password) {

        // if(!name) throw "Please enter a valid input for name";

        validate.validateUserEmailPassword(email, password)

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