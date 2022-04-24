const mongoCollections = require('../config/mongoCollections');
const tests = mongoCollections.courses;
const test = require('./courses');
const { ObjectId } = require('mongodb');
// const { tests } = require('.');
//const errorMsg = "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters";

module.exports = {
    async create(courseId, question, answer1, answer2, answer3, answer4) {
        if (!courseId) throw 'bandId should be passed';
    if (typeof courseId != 'string' || courseId.trim() === '') throw 'bandId is not of type string';
    
        if (!question) throw 'All fields need to have valid values';
        if (!answer1) throw 'All fields need to have valid values';
        if (!answer2) throw 'All fields need to have valid values';
        if (!answer3) throw 'All fields need to have valid values';
        if (!answer4) throw 'All fields need to have valid values';

        if (typeof question !== 'string') throw 'question must be a string';
        if (typeof answer1 !== 'string') throw 'answer1 must be a string';
        if (typeof answer2 !== 'string') throw 'answer2 must be a string';
        if (typeof answer3 !== 'string') throw 'answer3 must be a string';
        if (typeof answer4 !== 'string') throw 'answer4 must be a string';
        if (answer1.trim() === '') throw 'answer1 must be a string';
        if (answer2.trim() === '') throw 'answer2 must be a string';
        if (answer3.trim() === '') throw 'answer3 must be a string';
        if (answer4.trim() === '') throw 'answer4 must be a string';
        let parseId = ObjectId(testId);


        const testCollection = await tests();
        await testCollection.findOne({ _id: parseId }).then(test => {
            if (!test) throw new Error('Unable to find Questions');

            });
       
        let questionObj = {
            _id: ObjectId(),
            question: question,
            answer1: answer1,
            answer2: answer2,
            answer3: answer3,
            answer4:answer4,

        };
        
        await testCollection.updateOne({ _id: parseId }, { $push: { questions: questionObj } });
        return await test.get(parseId.toString());
    },

    
}