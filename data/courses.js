const mongoCollections = require("../config/mongoCollection");
const courses = mongoCollections.courses;
const { ObjectId } = require("mongodb");


module.exports = {
    async addCourse(courseName, description, image, video_id, branch) {
        if (!courseName) throw 'All fields need to have valid values';
        if (!description) throw 'All fields need to have valid values';
        if (!image) throw 'All fields need to have valid values';
        if (!branch) throw 'All fields need to have valid values';
        if (!video_id) throw 'All fields need to have valid values';
        if (typeof courseName !== 'string') throw 'Name must be a string';
        if (typeof description !== 'string') throw 'Description must be a string';
        if (typeof branch !== 'string') throw 'Branch must be a string';
        if (courseName.trim().length === 0) throw 'name cannot be an empty string or just spaces';
        if (description.trim().length === 0) throw 'description cannot be an empty string or just spaces';
        if (branch.trim().length === 0) throw 'branch cannot be an empty string or just spaces';

        const courseCollection = await courses();
        let videos = [];
        let newCourse = {
            courseName: courseName,
            branch: branch,
            //    userId:userId,
            description: description,
            image: image,
            videos: videos,
            questions: []
           

        }
        const insertInfo = await courseCollection.insertOne(newCourse);
        if (!insertInfo.insertedId)
            throw "Could not add course";
        else
            return { courseInserted: true };

    },
    async getAllCourses() {
        const courseCollection = await courses();
        const courseList = [];
        await courseCollection.find({}).toArray().then((courses) => {
            courses.forEach(course => {
                courseList.push({ "_id": course._id, "courseName": course.courseName, 'description': course.description });
            });
        });
        return courseList;
    },
    async getCourseById(id) {
        const courseCollection = await courses();
        const course = await courseCollection.findOne({ _id: ObjectId(id) });
        return course;
    },
    async deleteCourse(id) {
        const courseCollection = await courses();
        const flag = await courseCollection.deleteOne({ "_id": ObjectId(id) });
        return flag;
    },
    async getCourseByName(name) {
        try {
        if (!name) throw 'All fields need to have valid values';
        if (typeof name !== 'string') throw 'Name must be a string';
        if (name.trim().length === 0) throw 'name cannot be an empty string or just spaces';
            const courseCollection = await courses();
            let uname = name.split(" ").map(cname => {
                return cname[0].toUpperCase() + cname.slice(1);
            })
            var sname= uname.join(" ");
            const course = await courseCollection.findOne({ courseName: sname });
            return course;
    }
        catch (error) {
            throw new Error(error.message)
        }

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

}


    