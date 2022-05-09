const mongoCollections = require("../config/mongoCollection");
const videos = mongoCollections.videos;
const courses = mongoCollections.courses;
const users = mongoCollections.users;
const courses_func = require('./courses')
const validateRev = require('../validation/reviewValidate');
// const courses_func = require('./courses')
const validateVideo = require('../validation/videoValidate');
const validateCourse = require("../validation/courseValidate");
const validateUser = require("../validation/userValidate");
const { ObjectId } = require("mongodb");
// const bcrypt = require('bcrypt');
// const saltRounds = 12;

module.exports = {
    async createVideo(title,id, course_name){
        // const videocollection = await videos()
        validateVideo.checkTitle(title);
        validateCourse.checkVid(id);
        validateCourse.checkName(course_name);

        let newvideo = {
            title: title,
            video_id: id,
            comments: [],
        }
        const coursescollection = await courses()
        let courseinfo = await coursescollection.findOne({ courseName: course_name})
        // console.log(courseinfo)
        if (courseinfo.videos){
            var found = courseinfo.videos.some(el => el.video_id === id)
        }
        else{
            var found = false
        }
        if(!found){
            courseinfo.videos.push(newvideo)
            var insertInfo = await coursescollection.updateOne({_id: ObjectId(courseinfo._id)},[{$set: {videos: courseinfo.videos} }])
        }
        else{
            throw " Video already exists"
        }
        // console.log(courseinfo)
        // console.log(insertInfo)
        // const insertInfo = await videocollection.insertOne(newvideo);
        if (insertInfo.modifiedCount === 0)
            throw "Could not add video";
        else
            return {videoInserted: true}
    },

    // async getVideos(){
    //     const videocollection = await videos();
    //     let data = await videocollection.find({}).toArray();
    //     // console.log(data)
    //     return data
    // },

    async getVideos(email,course_name){
        validateUser.validateEmail(email);
        validateCourse.checkName(course_name);
        email = email.trim();
        email = email.toLowerCase();
        // const userCollection = await users();
        // const user = await userCollection.findOne({email: email});
        const userCollection = await users()
        // const coursedata = await courses_func.getCourseByName(course_name)
        const courseCollection = await courses();
        const coursedata = await courseCollection.findOne({ courseName: course_name});
        // console.log(coursedata)
        let courseinfo = await userCollection.find({ email:email },{courses:{$elemMatch:{_id:coursedata._id} }, "courses.videos":1}).toArray();
        // console.log("++++++++++++++++++++++++++")
        // console.log(courseinfo);
        if(courseinfo){
            for(var i of courseinfo[0].courses){
                // console.log(i)S
                if(i._id.equals(coursedata._id)){

                    // console.log(i.videos)

                    return i.videos
                }
            }
        }
        // return courseinfo
    },

    async addtime(email,data){
        // const videocollection = await videos();
        const userCollection = await users();
        // console.log(email)
        email = email.trim();
        email = email.toLowerCase();
        // console.log(typeof(data))
        if(typeof(data)==='undefined') throw "No data provided";

        // let data_up = await videocollection.findOne({video_id:data.video_id});
        let data_up = await userCollection.aggregate([
            {
                "$match": {
                    "email":email,
                    "courses.videos.video_id": data.video_id
                }
            },
            // {
            //     $project:{"courses.videos":1, "courses._id":1}
            // }
            
            ]).toArray();
        // console.log(data_up)
        for(var i in data_up[0].courses){
            if(data_up[0].courses[i].videos){
            for (var j in data_up[0].courses[i].videos){
                if(data_up[0].courses[i].videos[j].video_id === data.video_id)
                {
                    data_up[0].courses[i].videos[j].resume = data.resume;
                    data_up[0].courses[i].videos[j].duration = data.duration;
                    data_up[0].courses[i].videos[j].done = data.done;
                }
            }
        }
        }
        // console.log(data_up[0])
        // data_up.resume = data.resume;
        // data_up.duration = data.duration;
        // data_up.done = data.done;
        const updatedInfo = await userCollection.updateOne(
            {_id:data_up[0]._id},
            { $set: {courses:data_up[0].courses} }
        );
        if (updatedInfo.modifiedCount === 0) {
            throw "could not update video successfully";
        }
        return {'TimeUpdated':true}
    },

    async createframe(){
        var playerInfoList = [{id:'player',height:'390',width:'640',videoId:'M7lc1UVf-VE'},{id:'player1',height:'390',width:'640',videoId:'M7lc1UVf-VE'}];

        function onYouTubeIframeAPIReady() {
            if(typeof playerInfoList === 'undefined')
                return; 

            for(var i = 0; i < playerInfoList.length;i++) {
                var curplayer = createPlayer(playerInfoList[i]);
            }   
            }
        function createPlayer(playerInfo) {
            return new YT.Player(playerInfo.id, {
                height: playerInfo.height,
                width: playerInfo.width,
                videoId: playerInfo.videoId
            });
        }
    },

    async addComment(coursename, vidId, uId, userName, text){
        validateCourse.checkName(coursename);
        validateCourse.checkVid(vidId);
        validateUser.validateId(uId);
        validateUser.validateName(userName);
        validateRev.checkText(text);
        text = text.trim();
        const coursescollection = await courses();
        let courseinfo = await coursescollection.findOne({ courseName: coursename})
        // console.log('-------courseinfo.videos-------',courseinfo.videos)
        if (courseinfo.videos){
            var found = courseinfo.videos.some(el => el.video_id === vidId)
        }
        else{
            var found = false
        }
        if(found){
            let video = courseinfo.videos.find(vid => vid.video_id === vidId);
            let comment = {
                _id: ObjectId(),
                userId: uId,
                userName: userName,
                text:text,
            }
            let newvideo = {
                title: video.title,
                video_id: video.video_id,
                comments: video.comments,
            }
            newvideo.comments.push(comment);
            let currVideId = video.video_id;

            var deleteInfo = await coursescollection.updateOne(
                {_id: ObjectId(courseinfo._id)},
                {$pull: {videos: {video_id: currVideId}}},
            )
            if (deleteInfo.modifiedCount === 0) {
                throw 'could not delete video';
            }

            var insertInfo = await coursescollection.updateOne(
                {_id: ObjectId(courseinfo._id)},
                {$push: {videos: newvideo}},
            );

            if (insertInfo.modifiedCount === 0) {
                throw 'could not update comment';
            }

            return {commentInserted: true, commentVal: comment, vidName: newvideo.title};
        }else{
            return {error: "Video does not exits"};
        }

    },

}

async function main(){
    try{
        // console.log(await module.exports.createVideo('Demo Video', 'M7lc1UVf-VE'))
        // console.log(await module.exports.createVideo('First Video', '3JluqTojuME'))
        // console.log(await module.exports.createVideo('Second Video', 'Q33KBiDriJY'))
        // console.log(await module.exports.createVideo('fourth Video', 'fqdidduTuZM'))
        // console.log(await module.exports.getVideos());
        // console.log(await module.exports.addtime('3JluqTojuME',250));
        // console.log(await module.exports.createVideo('Demo Video', 'M7lc1UVf-VE', 'Web Programming'))
        // console.log(await module.exports.createVideo('First Video', '3JluqTojuME','Web Programming'))
        // console.log(await module.exports.createVideo('Second Video', 'Q33KBiDriJY', 'Web Programming'))
        // console.log(await module.exports.getVideos('pjhangl1@stevens.edu','Web Programming'))
        // console.log(await module.exports.addtime('pjhangl1@stevens.edu',''))

        // console.log(await module.exports.getprogress('pjhangl1@stevens.edu','Web Programming'));
        console.log(await module.exports.getVideos('preet@gmail.com','Demo 2'));
        process.exit(0)
        
    }catch(e){
        console.log(e)
        process.exit(0)
    }
}

// main();
