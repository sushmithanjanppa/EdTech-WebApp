const mongoCollections = require("../config/mongoCollections");
const videos = mongoCollections.videos;
// const validation = require('../tasks/validation')
const { ObjectId } = require("mongodb");
// const bcrypt = require('bcrypt');
// const saltRounds = 12;

module.exports = {
    async createVideo(title,id){
        const videocollection = await videos()
        let newvideo = {
            title: title,
            video_id: id
        }
        const insertInfo = await videocollection.insertOne(newvideo);
        if (!insertInfo.acknowledged || !insertInfo.insertedId)
            throw "Could not add video";
        else
            return {videoInserted: true}
    },

    async getVideos(){
        const videocollection = await videos();
        let data = await videocollection.find({}).toArray();
        // console.log(data)
        return data
    },

    async addtime(data){
        const videocollection = await videos();
        let data_up = await videocollection.findOne({video_id:data.video_id});
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
    }
//     async createUser(username, password){
//         // console.log("in create user")
//         username = validation.checkusername(username,'Username')
//         password = validation.checkpassword(password, 'Password')
//         const usercollection = await users()
//         const username_dup = await usercollection.findOne({username : username})
//         if (username_dup !== null)
//             throw `${username} already exists.`
//         else
//         {
//             password = await bcrypt.hash(password, saltRounds);
//             let newUser = {
//                 username: username,
//                 password: password
//             };
//             const insertInfo = await usercollection.insertOne(newUser);
//             if (!insertInfo.acknowledged || !insertInfo.insertedId)
//                 throw "Could not add user";
//             else
//                 return {userInserted: true}
//         }
//     },

//     async checkUser(username, password){
//         username = validation.checkusername(username,'Username')
//         password = validation.checkpassword(password, 'Password')
//         const usercollection = await users()
//         const username_dup = await usercollection.findOne({username : username})
//         if (username_dup === null)
//             throw `Either the username or password is invalid`
//         else
//         {
//             let compareToMatch = false;
//             try {
//                 compareToMatch = await bcrypt.compare(password, username_dup.password);
//             } catch (e) {
//                 console.log(e)
//             }

//             if (compareToMatch) {
//                 return {authenticated: true}
//             } else {
//                 throw `Either the username or password is invalid`
//             }
//         }
// }
// }
    }

async function main(){
    try{
        // console.log(await module.exports.createVideo('Demo Video', 'M7lc1UVf-VE'))
        // console.log(await module.exports.createVideo('First Video', '3JluqTojuME'))
        // console.log(await module.exports.createVideo('Second Video', 'Q33KBiDriJY'))
        console.log(await module.exports.createVideo('fourth Video', 'fqdidduTuZM'))
        // console.log(await module.exports.getVideos());
        console.log(await module.exports.addtime('3JluqTojuME',250));
        process.exit(0)
        
    }catch(e){
        console.log(e)
        process.exit(0)
    }
}

// main();
