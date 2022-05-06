const mongoCollections = require("../config/mongoCollection");
const courses = mongoCollections.courses;
const { ObjectId } = require("mongodb");


module.exports = {
    async addCourse(courseName,description, image, video_id,branch){
        const courseCollection = await courses();
        let videos=[];
        let newCourse={
           courseName:courseName,
           branch:branch,
        //    userId:userId,
           description:description,
           image:image,
           videos:videos,
           questions:[]
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
    async getCourseByName(name){
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ courseName: name});
        return course;
    },
    async getfilterByBranch(branch) {
        try {
            
            const courseCollection = await courses();
            const course = await courseCollection.find({ branch: branch}).toArray();
            return course
            
        }
        catch (error) {
            throw new Error(`Unable to retrieve course. Check again later..`)
        }
    },

}