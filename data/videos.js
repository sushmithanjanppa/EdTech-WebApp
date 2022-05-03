const mongoCollections = require("../config/mongoCollection");
const videos = mongoCollections.videos;
const courses = mongoCollections.courses;
const users = mongoCollections.users;
const courses_func = require('./courses')
// const validation = require('../tasks/validation')
const { ObjectId } = require("mongodb");
// const bcrypt = require('bcrypt');
// const saltRounds = 12;

module.exports = {
    async createVideo(title,id, course_name){
        // const videocollection = await videos()
        let newvideo = {
            title: title,
            video_id: id
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
        // validate.validateEmail(email);
        email = email.trim();
        email = email.toLowerCase();
        // const userCollection = await users();
        // const user = await userCollection.findOne({email: email});
        const userCollection = await users()
        const coursedata = courses_func.getCourseByName(course_name)
        let courseinfo = await userCollection.find({ email:email },{courses:{$elemMatch:{_id:coursedata._id} }, "courses.vdeos":1}).toArray();
        // console.log(courseinfo[0]["courses"])
        return courseinfo[0].courses[0].videos
    },

    async addtime(email,data){
        // const videocollection = await videos();
        const userCollection = await users();
        // let data_up = await videocollection.findOne({video_id:data.video_id});
        let data_up = await userCollection.find({email:email},{'courses.videos':{$elemMatch:{video_id:data.video_id}}}).toArray();
        console.log(data_up)
        data_up.resume = data.resume;
        data_up.duration = data.duration;
        data_up.done = data.done;
        const updatedInfo = await videocollection.updateOne(
            {video_id:data.video_id},
            { $set: data_up }
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

    async getprogress(){
        const videocollection = await videos();
        let data = await videocollection.find({},{projection:{_id:1,done:1}}).toArray();
        // console.log(data);
        count = 0
        for(var i = 0; i < data.length; i++){
            if(data[i].done === true){
                count += 1
            }
        }
        return (count*100/data.length)
    }
}

async function main(){
    try{
        // console.log(await module.exports.createVideo('Demo Video', 'M7lc1UVf-VE'))
        // console.log(await module.exports.createVideo('First Video', '3JluqTojuME'))
        // console.log(await module.exports.createVideo('Second Video', 'Q33KBiDriJY'))
        // console.log(await module.exports.createVideo('fourth Video', 'fqdidduTuZM'))
        // console.log(await module.exports.getVideos());
        // console.log(await module.exports.addtime('3JluqTojuME',250));
        console.log(await module.exports.createVideo('Demo Video', 'M7lc1UVf-VE', 'Web Development'))
        console.log(await module.exports.createVideo('First Video', '3JluqTojuME','Web Development'))


        //PYTHON
        console.log(await module.exports.createVideo('First Video', 'uQrJ0TkZlc','Python for Everybody Specialization'))

        //uQrJ0TkZlc

        // console.log(await module.exports.getVideos('pjhangl1@stevens.edu','Web Programming'))

        // await module.exports.getprogress();
        process.exit(0)
        
    }catch(e){
        console.log(e)
        process.exit(0)
    }
}

// main();
