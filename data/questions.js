const mongoCollections = require('../config/mongoCollection');
const courses = mongoCollections.courses;
const course = require('./courses');
const { ObjectId } = require('mongodb');



module.exports = {
    async create(courseId, question, answer1, answer2, answer3, answer4, sectionid, answer) {
        if (!courseId) throw 'courseId should be passed';
    if (typeof courseId != 'string' || courseId.trim() === '') throw 'courseId is not of type string';
    
        if (!question) throw 'quest fields need to have valid values';
        if (!answer1) throw 'ans1 fields need to have valid values';
        if (!answer2) throw 'ams2 fields need to have valid values';
        if (!answer3) throw 'ans3 fields need to have valid values';
        if (!answer4) throw 'ans4 fields need to have valid values';
        if (!sectionid) throw 'secid fields need to have valid values';
        if (!answer) throw 'Ans fields need to have valid values';

        if (typeof question !== 'string') throw 'question must be a string';
        if (typeof answer1 !== 'string') throw 'answer1 must be a string';
        if (typeof answer2 !== 'string') throw 'answer2 must be a string';
        if (typeof answer3 !== 'string') throw 'answer3 must be a string';
        if (typeof answer4 !== 'string') throw 'answer4 must be a string';
        if (typeof sectionid !== 'string') throw 'website must be a string';
        if (typeof answer !== 'string') throw 'website must be a string';

        if (answer1.trim() === '') throw 'answer1 must be a string';
        if (answer2.trim() === '') throw 'answer2 must be a string';
        if (answer3.trim() === '') throw 'answer3 must be a string';
        if (answer4.trim() === '') throw 'answer4 must be a string';
        if (sectionid.trim() === '') throw 'website must be a string';
        if (answer.trim() === '') throw 'website must be a string';
        let parseId = ObjectId(courseId);


        const courseCollection = await courses();
        await courseCollection.findOne({ _id: parseId }).then(course => {
            if (!course) throw new Error('Unable to find Questions');

            });
       
            let questionObj = {
                _id: ObjectId(),
                question: question,
                answer1: answer1,
                answer2: answer2,
                answer3: answer3,
                answer4:answer4,
                sectionid:sectionid,
                answer:answer

        };
        
        await courseCollection.updateOne({ _id: parseId }, { $push: { questions: questionObj } });
        return await course.getCourseById(parseId.toString());
    },

    async getAll(courseId) {

        if (!courseId) throw 'courseId should be passed';
        if (typeof courseId != 'string' || courseId.trim() === '') throw 'courseId is not of type string';
        courseId = courseId.trim();
        if (!ObjectId.isValid(courseId)) throw 'invalid object ID';
        let parseId = ObjectId(courseId);
        const courseCollection = await courses();
        return await courseCollection.findOne({ _id: parseId }).then(course => {
            if (!course) throw new Error('Unable to find coourse');
            return course.questions
        });
    } ,
     async get(questionId) {
    
        if (!questionId) throw 'questionId should be passed';
        if (typeof questionId != 'string' || questionId.trim() === '') throw 'questionId is not of type string';
        questionId = questionId.trim();
        if (!ObjectId.isValid(questionId)) throw 'invalid object ID';
        let parseId = ObjectId(questionId);
        const courseCollection = await courses();
        return await courseCollection.findOne({ 'questions._id': parseId }).then(course => {
            if (!course) throw 'Unable to find course';
            for (const question of course.questions) {
                if (question._id.toString() == parseId.toString()) {
                    return question;
                }
            }
        });
    
    
    }, 
}