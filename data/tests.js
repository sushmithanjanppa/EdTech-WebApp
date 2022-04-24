const mongoCollections = require('../config/mongoCollections');
const tests = mongoCollections.tests;
const { ObjectId } = require('mongodb');

module.exports = {
    // This is a fun new syntax that was brought forth in ES6, where we can define
    // methods on an object with this shorthand!
    async create(name) {
        if (!name) throw 'All fields need to have valid values';
        if (typeof name !== 'string') throw 'Name must be a string';
        if (name.trim() === '') throw 'website must be a string';

        let newQuestion = {
            name: name,
            questions: []

        }
        const testCollection = await tests();
        const insertTest = await testCollection.insertOne(newQuestion);
        if (insertTest.insertedCount === 0) throw 'Could not add band';
        const newId = insertTest.insertedId;
        const test = await this.get(newId);
        console.log(test)
        //band._id=band._id.toString();
        return test;
    },

    async getAll() {
        const testCollection = await tests();
        const testList = await testCollection.find({}).toArray();

        if (!testList) throw 'Could not get all test';
        testList.forEach(test => {
            test._id = test._id.toString();
        });
        return testList;
    },

    async get(id) {

        if (!id) throw `id should be passed`;
        if (typeof id != 'string' || id.trim() === '') throw `${id} is not of type string`;

        let parseId = ObjectId(id);


        const testCollection = await tests();
        const test = await testCollection.findOne({ _id: parseId });
        if (test === null) throw `No bands with the given id`;

        return test;

    },
    // async enterAnswer(answer) {
    //     try {
    //         if (!answer) throw 'All fields need to have valid values';
    //         if (typeof answer !== 'string') throw 'Name must be a string';
    //         if(answer.trim() === '') throw 'website must be a string';

    //         const answerCollection = await answer();

    //         const answer = await answerCollection.findOne({ answer: answer.toLowerCase() });
    //         if (answer) 
    //         return answer

    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // },
    // async checkAnswer(question, answer1, answer2, answer3, answer4) {
    //     try {

    //         const testCollection = await tests();

    //         const user = await testCollection.findOne({ question: question.toLowerCase() });
    //         if (!answer1) throw new Error('Error message: Either the username or password is invalid');
    //         if (!answer2) throw new Error('Error message: Either the username or password is invalid');
    //         if (!answer3) throw new Error('Error message: Either the username or password is invalid');
    //         if (!answer4) throw new Error('Error message: Either the username or password is invalid');

    //         if (!await hashUtils.compareAnswe(answer1, user.answer)) {
    //             throw new Error('Error message: answer is invalid')
    //         }

    //         const response = {
    //             authenticated: true
    //         };
    //         return response;
    //     } catch (error) {
    //         throw new Error(error.message);
    //     }
    // }
}