const mongoCollections = require("../config/mongoCollection");
const courses = mongoCollections.courses;
const video_func = require("./videos");
const { ObjectId } = require("mongodb");
const validateRev = require("../validation/reviewValidate");

module.exports = {
    async addCourse(courseName,description, image, video_id){
        const courseCollection = await courses();
        let videos=[];
        let newCourse={
           courseName:courseName,
        //     userId:userId,
           description:description,
           image:image,
           videos:videos,
           reviews: [],
           overallRating: 0.0,
        }
        const insertInfo = await courseCollection.insertOne(newCourse);
        if (!insertInfo.insertedId)
        throw "Could not add course";
        else{
            try{
                if (Array.isArray(video_id)){
                    for(var i in video_id){
                        await video_func.createVideo(title='video '+ i, id=video_id[i], course_name = courseName)
                    }
                }
                // else{
                //     await video_func.createVideo(title='video 0', id=video_id, course_name = courseName)
                // }
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
    async getCourseByName(name){
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ courseName: name});
        return course;
    },

    async addReview(courseId, uId, text, rating){
        validateRev.checkRating(rating);
        rating = Number.parseInt(rating);
        validateRev.checkText(text);
        text = text.trim();
        const courseCollection = await courses();
        const currCourse = await this.getCourseById(courseId);
        
        const newReview = {
            _id: ObjectId(),
            userId: uId,
            text: text,
            rating: rating,
        }

        let newRating = ((currCourse.overallRating*currCourse.reviews.length)+rating)/(currCourse.reviews.length+1);
        if(currCourse.reviews.length===0)
            newRating = rating;
            
        console.log('\n new rat: ',Number(newRating))
        const updatedInfo = await courseCollection.updateOne(
            { _id: ObjectId(courseId) },
            { $addToSet: {reviews: newReview} }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw 'could not update course';
        }
        const updatedRating = await courseCollection.updateOne(
            { _id: ObjectId(courseId) },
            { $set: {overallRating: Number(newRating)} }
        );

        return {reviewAdded: true};
    }

}