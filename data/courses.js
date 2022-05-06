const mongoCollections = require("../config/mongoCollection");
const courses = mongoCollections.courses;
const video_func = require("./videos");
const { ObjectId } = require("mongodb");


module.exports = {
    async addCourse(courseName,description, image, video_id){
        const courseCollection = await courses();
        let videos=[];
        let newCourse={
           courseName:courseName,
           branch:branch,
           description:description,
           videos:videos,
           questions: [],
           image:image,
           videos:videos
        }
        const insertInfo = await courseCollection.insertOne(newCourse);
        if (!insertInfo.insertedId)
        throw "Could not add course";
        else{
            try{
                for(var i in video_id){
                    await video_func.createVideo(title='video '+ i, id=video_id[i], course_name = courseName)
                }
            }
            catch(e){
                throw "couldnt add course"
            }
            return {courseInserted: true};
        }

    },
    async getAllCourses(){
        const courseCollection = await courses();
        const courseList = [];
        await courseCollection.find({}).toArray().then((courses) => {
            courses.forEach(course => {
                courseList.push({ "_id": course._id, "courseName": course.courseName ,'description':course.description, 'image':course.image});
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
   
    async getfilterByBranch(branch) {
        try {
            const result = data.filter(d => d.branch == branch);

            return result;
        }
        catch (error) {
            throw new Error(`Unable to retrieve course. Check again later..`)
        }
    },
    async getCourseByName(name){
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ courseName: name});
        return course;
    }

}