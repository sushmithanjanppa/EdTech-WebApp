const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const { ObjectId } = require("mongodb");


module.exports = {
    async addCourse(courseName,description){
        const courseCollection = await courses();
        let videos=[];
        let newCourse={
           courseName:courseName,
        //    userId:userId,
           description:description,
           videos:videos,
           questions: []
        }
        const insertInfo = await courseCollection.insertOne(newCourse);
        if (!insertInfo.insertedId)
        throw "Could not add course";
        else
        return {courseInserted: true};

    },
    async getAllCourses(){
        const courseCollection = await courses();
        const courseList = [];
        await courseCollection.find({}).toArray().then((courses) => {
            courses.forEach(course => {
                courseList.push({ "_id": course._id, "courseName": course.courseName ,'description':course.description});
            });
        });
        return courseList;
    },
    async getCourseById(id){
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ _id: ObjectId(id) });
        return course;
    },
    async deleteCourse(id){
        const courseCollection = await courses();
        const flag = await courseCollection.deleteOne( { "_id" : ObjectId(id) } );
        return flag;
    },
    async getcourseByName(courseName) {
        try {
            const courseCollection = await courses();
            const response = await courseCollection.findOne({courseName: courseName});
            return response;
        } catch (error) {
            throw new Error(`Unable to retrieve course. Check again later..`)
        }
    },

}