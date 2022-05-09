const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const validate = require('../validation/userValidate');
const videos = require('../data/videos');
const xss = require('xss');
const crossPageNavs = {
  top: "http://localhost:3000/#top",
  // team: "http://localhost:3000/#team",
  about: "http://localhost:3000/#about",
  courses: "http://localhost:3000/#courses",
  reviews: "http://localhost:3000/#reviews",
  team: "http://localhost:3000/#team"
};

router.get('/', async (req, res) => {
    try{
      if(req.session.user){
        let uemail = req.session.user.email;
        const userInfo = await userData.getUser(uemail);
        const progress = await userData.get_user_course_progress(uemail);
        res.render("users/userPage",{title: "User Page",data: userInfo ,title: "Profile", location: crossPageNavs,notLoggedIn: req.session.user ? false : true, progress_data: JSON.stringify(progress)});
      }
    }catch(e){
      console.log(e)
      res.status(400).render('users/index', {title: "User Page", error: e, notLoggedIn: req.session.user ? false : true});
    }
});

router.post('/editinfo', async (req, res) => {
  try{
    if(req.session.user){
      let uemail = xss(req.session.user.email);
      // console.log(req.body)
      const userinfo = await userData.getUser(uemail)
      // console.log(userinfo)
      userinfo.name = xss(req.body.Name);
      userinfo.age = xss(req.body.Age);
      userinfo.gender = xss(req.body.Gender);
      userinfo.userType = xss(req.body.UserType);
      const user = await userData.editUserInfo(uemail,req.body.Name,req.body.Gender,req.body.Age, req.body.UserType)
      if (user.UserUpdated){
        req.session.user_type = {type: xss(req.body.userType)};
        res.send({success:true})
      }
      else{
        res.send({success:false})
      }
    }
  }catch(e){
    console.log(e)
      // res.status(400).render('users/userPage', {error: e, notLoggedIn: req.session.user ? false : true});
      res.status(400).send({error:e})
  }
});
module.exports = router;

