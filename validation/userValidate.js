const emailValidator = require('email-validator')
const { ObjectId } = require('mongodb');

module.exports = {
    validateEmail(email){
        if(typeof(email)==='undefined') throw "Please enter a valid input for email";
        if(typeof(email) !== 'string') throw "Invalid email: email can only be string value";
        if(email.trim().length === 0) throw "Invalid email: email cannot be blank";
        email = email.trim();
        if(!emailValidator.validate(email)) throw "Invalid email";
    },

    validatePassword(pass){
        if(typeof(pass)==='undefined') throw 'Please enter a valid input for password';
        if(typeof(pass)!=='string') throw 'Invalid password: password must be a string';
        pass = pass.trim();
        if(pass.length===0) throw 'Invalid password: Password cannot be blank';
        if(/\s/g.test(pass)) throw 'Invalid password: Password cannot have spaces';
        if(pass.length<6) throw 'Invalid password: Password must be at least 6 characters long';
    },
    
    validateName(name){
        if(typeof(name)==='undefined') throw "Please enter a valid input for name";
        if(typeof(name) !== 'string') throw 'You must provide string value for name';
        // console.log(parseInt(name))
        if(parseInt(name)) throw 'Name should be all alphabets.'
        if(name.trim().length === 0) throw "Name cannot be blank"
    },

    validateGender(gen){
        if(typeof(gen)==='undefined') throw "Please select a gender from the gender field";
        if(typeof(gen) !== 'string') throw "Gender value mst be a string";
        gen = gen.trim();
        if(gen.length===0) throw "Gender field cannot be blank";
        if(gen!='Man' && gen!='Woman' && gen!='Transgender' && gen!='other') throw "Please select a proper gender identity";
    },

    validateAge(age){
        if(typeof(age)==='undefined') throw "Age cannot be blank";
        if(typeof(age)==='string' && typeof(parseInt(age))!='number') throw 'Invalid age';
        else if(typeof(age)!='number' && (typeof(age)!='string')) throw 'Invalid month'
        if(age.length===0) throw "Age cannot be blank";
        if(typeof(age)==='string') age = Number(age); 
        if(age<12) throw "Minimum age to register is 12";
    },

    validateUserType(userType){
        if(typeof(userType)==='undefined') throw "Please select a user type";
        if(typeof(userType)==='string' && Number.parseInt(userType)==='NaN') throw 'Invalid user type';
        if(userType.length===0) throw "User type field cannot be blank";
        userType = Number.parseInt(userType); 
        if(userType!=0 && userType!=1) throw "Invalid user type";
    },

    validateId(id){
        if(typeof(id)==='undefined') throw 'Please provide an id';
        id = id.toString();
        if(typeof(id)!='string') throw 'id is not string type';
        id = id.trim();
        if(id.length===0) throw 'empty id provided';
        if (!ObjectId.isValid(id)) throw 'id not a valid object ID';
    },

}