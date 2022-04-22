const express = require('express');
const router = express.Router();
const videos = require('../data/videos')
// const validation = require('../tasks/validation')

router.get('/', async (req, res) => {
    // const postList = await postData.getAllPosts();
    // console.log("Get");
    // if (req.session.user){
    //     // return res.render("login/form", {user: req.session.user});
    //     return res.redirect("/course");    
    // }
    return res.render('edu/index')
});

router.get('/video', async(req,res) => {
    let data = await videos.getVideos();
    // console.log(data);
    // res.locals.videodata = JSON.stringify(data)
    // console.log(res.locals.videodata)
    return res.render('edu/video',{videodata : JSON.stringify(data)});
})

router.post('/video', async(req,res) => {
    // console.log("post")
    // console.log(req.body)
    // let timeupdated = await videos.addtime(id = req.body.video_id, time = req.body.resume)
    let timeupdated = await videos.addtime(data = req.body)
    if (!timeupdated.TimeUpdated){
        console.log("Updation Failed")
    }
    else{
        console.log("Updated")
    }
})

router.get('/progress', async(req, res) => {
    let data = await videos.getprogress();
    return res.render('edu/progress',{videodata : JSON.stringify(data)});
})


module.exports = router