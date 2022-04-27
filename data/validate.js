const mongoCollections = require("../config/mongoCollection");
const courses = mongoCollections.courses;
const { ObjectId } = require("mongodb");
const emailValidate = require('email-validator')

module.exports = {
    async validateUserEmailPassword(email, password){

        if(!email) throw "Please enter a valid input for email";

        if(!password) throw "Please enter a valid input for password";

        if(typeof email !== 'string' || typeof password !== 'string') throw "You must provide string values in the inputs of name, email and password.";

        if(email.trim().length == 0 || password.trim().length == 0) throw "Do not enter blank spaces for name, email and password."

        if (password.length < 6) throw "The minimum length of password should be atleast 6.";
        
        if (!emailValidate.validate(email)) throw "The email should be valid";

        let passValidate = /^(?!.* ).{6,20}$/gi;
        if (!password.match(passValidate)) throw "The password should be valid and should only contain any other character including special characters";
    },
    
    async validateUserEmailPasswordName(name, email, password){
        
        if(!name) throw "Please enter a valid input for name";

        if(typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') throw 'You must provide string values in the inputs of name, email and password.';

        if(name.trim().length == 0 ||email.trim().length == 0 || password.trim().length == 0) throw "Do not enter blank spaces for name, email and password."

        this.validateUserEmailPassword(email, password)

    },

}