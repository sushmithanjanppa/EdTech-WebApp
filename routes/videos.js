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

// router.post('/login', async(req,res,) => {
//     let username = req.body.username;
//     let password = req.body.password;
//     try{
//         username = validation.checkusername(username);
//         password = validation.checkpassword(password);
//     }
//     catch(e){
//         // console.log(e)
//         return res.status(400).render("login/form", {error:e, user:false})
//     }
//     try{
//         let check_login = await users.checkUser(username = username, password = password)
//         // console.log(check_login)
//         if (check_login.authenticated)
//             req.session.user = {username: username};
//             return res.redirect("/private");
//     }
//     catch(e){
//         // console.log(e);
//         return res.status(400).render("login/form", {error:e, user:false})
//     }
// })

// router.get('/private', async(req, res) => {
//     return res.status(200).render("login/private", {username: req.session.user.username, user:true});
// })

// router.get('/signup', async (req, res) => {
//     // const postList = await postData.getAllPosts();
//     // console.log("Get");
//     return res.render("login/signup", {user:false});
// });

// router.post('/signup', async(req,res) => {
//     let username = req.body.username;
//     let password = req.body.password;
//     try{
//         username = validation.checkusername(username);
//         password = validation.checkpassword(password);
//     }
//     catch(e){
//         // console.log(e)
//         return res.status(400).render("login/signup", {error:e,user:false})
//     }
//     try{
//         let check_login = await users.createUser(username = username, password = password)
//         // console.log(check_login)
//         if (check_login.userInserted)
//             // req.session.user = {username: username};
//             return res.redirect("/");
//         else
//             return res.status(500).send("Internal Server Error");
//     }
//     catch(e){
//         // console.log(e);
//         return res.status(400).render("login/signup", {error:e, user:false})
//     }
// })

// router.get('/logout', async (req, res) => {
//     req.session.destroy();
//     return res.render("login/logout", {user:false});
// });


module.exports = router