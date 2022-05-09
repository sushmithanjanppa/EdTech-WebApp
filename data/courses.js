const mongoCollections = require("../config/mongoCollection");
const courses = mongoCollections.courses;
const video_func = require("./videos");
const { ObjectId } = require("mongodb");
const validateRev = require("../validation/reviewValidate");
const users = mongoCollections.users;
const xss = require('xss');
module.exports = {
    async addCourse(courseName, description, image, video_id, branch, email) {
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ courseName: courseName});
        if(course){
            throw "Course with same name Already Exists"
        }
        var uname = courseName.split(" ").map(cname => {
            return cname[0].toUpperCase() + cname.slice(1);
        })
        
        courseName = uname.join(" ");
        let videos = [];
        let newCourse = {
            courseName:courseName,
            email:email,
            description:description,
            image:image,
            videos:videos,
            reviews: [],
            overallRating: 0.0,
            questions: [],
            branch: branch
        }
        const insertInfo = await courseCollection.insertOne(newCourse);
        if (!insertInfo.insertedId)
            console.log("Could not add course")
        else{
            try{
                if (Array.isArray(video_id)){
                    for(var i in video_id){
                        await video_func.createVideo(title='video '+ i, id=video_id[i], course_name = courseName)
                    }
                }
                else if(video_id){
                    await video_func.createVideo(title='video 0', id=video_id, course_name = courseName)
                }

            }
            catch(e){
                throw "couldnt add course"
            }
            return {courseInserted: true};
        }


    },
    
    async getInstCourses(email){
        const courseCollection = await courses();
        const courseList = [];
        await courseCollection.find({email:email}).toArray().then((courses) => {
            courses.forEach(course => {
                courseList.push({ "_id": course._id, "courseName": course.courseName ,'description':course.description});
            });
        });
        return courseList;
    },
    async getAllCourses(){
        const courseCollection = await courses();
        const userCollection = await users();
        const courseList = [];
        await courseCollection.find({}).toArray().then((courses) => {
            courses.forEach(course => {
                courseList.push({ "_id": course._id, "courseName": course.courseName ,'description':course.description, 'image':course.image, 'email':course.email});
            });
        });
        for (var i in courseList){
            const user = await userCollection.findOne({email: courseList[i].email}); 
        if(user === null){
            courseList[i].inst_name = "Instructor Not Found"
        }
        else{
        courseList[i].inst_name = user.name
        }
        }

        return courseList;
    },
    async getCourseById(id) {
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ _id: ObjectId(id) });
        return course;
    },
    async deleteCourse(id) {
        const courseCollection = await courses();
        const flag = await courseCollection.deleteOne( { "_id" : ObjectId(id) } );
        return flag;
    },
    async getCourseByName(name) {
        try {
        if (!name) throw 'All fields need to have valid values';
        if (typeof name !== 'string') throw 'Name must be a string';
        if (name.trim().length === 0) throw 'name cannot be an empty string or just spaces';
            const courseCollection = await courses();
            var uname = name.split(" ").map(cname => {
                return cname[0].toUpperCase() + cname.slice(1);
            })
            var sname= uname.join(" ");
            // console.log(sname)
            var course = await courseCollection.findOne({ courseName: sname });
            // console.log(course)          
        }
        catch (error) {
            throw `Unable to retrieve course. Check again later..`
        }
        return course;  
    },

    async addReview(courseId, uId, text, rating){
        validateRev.checkRating(rating);
        rating = Number(rating);
        validateRev.checkText(text);
        text = text.trim();
        const courseCollection = await courses();
        const currCourse = await this.getCourseById(courseId);
        // console.log(rating)
        const newReview = {
            _id: ObjectId(),
            userId: uId,
            text: text,
            rating: rating,
        }

        // console.log('inside addReview',text, rating)
        // console.log('inside addReview',currCourse.overallRating, currCourse.reviews.length)
        
        let newRating = ((currCourse.overallRating*currCourse.reviews.length)+rating)/(currCourse.reviews.length+1);
        if(currCourse.reviews.length===0)
            newRating = rating;
            
        // console.log('\n new rat: ',Number(newRating))

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
    },

    async getfilterByBranch(branch) {

        if (!branch) throw 'All fields need to have valid values';
        if (typeof branch !== 'string') throw 'branch must be a string';
        if (branch.trim().length === 0) throw 'branch cannot be an empty string or just spaces';
        try {


            const courseCollection = await courses();
            const course = await courseCollection.find({ branch: branch }).toArray();
            return course

        }
        catch (error) {
            throw new Error(`Unable to retrieve course. Check again later..`)
        }
    },
    async modifyCourse(data){
        const courseCollection = await courses();
        const course = await courseCollection.findOne({"_id":ObjectId(data.course_id)})
        const course_old = course.courseName
        if(data.courseName.trim()){
            course.courseName = data.courseName.trim()
        }
        if(data.description.trim()){
            course.description = data.description.trim()
        }
        if(data.image.trim()){
            course.image = data.trim()
        }
        let update = await courseCollection.updateOne({"_id":ObjectId(data.course_id)}, [{$set:course}])
        if(update.modifiedCount){
        var cnt = course.videos.length
        try{
            if (Array.isArray(data.video_id)){
                for(var i in data.video_id){
                    await video_func.createVideo(title='video '+ cnt, id=data.video_id[i], course_name = data.courseName)
                    cnt = cnt + 1
                }
            }
            else if(data.video_id.trim()){
                await video_func.createVideo(title='video '+(cnt+1), id=data.video_id, course_name = data.courseName)
            }
        }
        catch(e){
            // throw "couldnt add course"
            console.log(e)
        }
        }
        else(
            console.log("Cant add course")
        )
        const course_up = await courseCollection.findOne({"_id":ObjectId(data.course_id)})
        const userCollection = await users()
        // const user_update = await userCollection.updateMany({"courses._id":  ObjectId(data.course_id)},
        //     {"$push" : {"courses.$.videos" : {"$each": course_up.videos.slice(cnt)}}})
        const user_update = await userCollection.updateMany({"courses._id":  ObjectId(data.course_id)},
            {"$set" : {"courses.$" :  course_up}})
        // console.log(user_update)
        if(user_update.modifiedCount === user_update.matchedCount){
            return {Modified:true}
        }

    }

}


async function main(){
    // console.log(await module.exports.getInstCourses("courses@gmail.com"))
    // console.log(await module.exports.deleteCourse("627567e57fa68b4567ec4017"))
    // const data = {
    //     courseName: 'Temp',
    //     description: 'This is a temp course',
    //     image: '',
    //     video_id: [ '3JluqTojuME', 'rfscVS0vtbw' ],
    //     course_id: '6275b26aeb6dba4d69c80d9e'
    // }
    const data = {
        courseName: 'Temp',
        description: 'This is a temp course',
        image: '',
        video_id: '3JluqTojuME',
        branch : "CS",
        email:"teacher@test.com"
    }
    // console.log(await module.exports.addCourse(data.courseName,data.description,data.image,data.video_id,data.branch,data.email))
    // console.log(await module.exports.getAllCourses())
    const c = await module.exports.getCourseByName('Web Development')
    console.log(c._id.toString())
}

// main();

