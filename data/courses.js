const mongoCollections = require("../config/mongoCollections");
const courseCollection = mongoCollections.courses;
const { ObjectId } = require("mongodb");

module.exports = {
    async addCourse(courseName,description){
        const courses = await courseCollection();
        let videos=[];
        let newCourse={
           courseName:courseName,
        //    userId:userId,
           description:description,
           videos:videos
        }
        const insertInfo = await courses.insertOne(newCourse);
        if (!insertInfo.insertedId)
        throw "Could not add course";
        else
        return {courseInserted: true};

    },

}