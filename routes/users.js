const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const videos = require('../data/videos');
const courses = require('../data/courses');
const validate = require('../validation/userValidate');
const validateReview = require("../validation/reviewValidate");
const e = require("express");

const samePageNavs = {
  top: "#top",
  about: "#about",
  courses: "#courses",
  reviews: "#reviews",
  team: "#team"
};
const crossPageNavs = {
  top: "/#top",
  about: "/#about",
  courses: "/#courses",
  reviews: "/#reviews",
  team: "/#team"
};


// USER ROUTES
router.get("/", async (req, res) => {
  var course_i = await courses.getAllCourses()
  // console.log(course_i)
  if(!req.session.user_type){
    req.session.user_type = {type: 0}
  }
  console.log(course_i)
  res.render("users/index", { title: "Login Page", location: samePageNavs, notLoggedIn: req.session.user ? false : true, course_info:JSON.stringify(course_i) , userType: req.session.user_type.type});
});

router.get("/signup", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/login");
  } else {
    res.status(401).render("users/signup", { title: "Signup Page", location: crossPageNavs , notLoggedIn: req.session.user ? false : true });
    res.render("users/signup", { title: "Signup Page", location: crossPageNavs , notLoggedIn: req.session.user ? false : true });
  }
});

router.post("/signup", async (req, res) => {
  let name= req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let age = req.body.age;
  let gender = req.body.gender;
  let userType = req.body.userType;

  try {
    await validate.validateName(name);
    await validate.validateEmail(email);
    await validate.validatePassword(password);
    await validate.validateAge(age);
    await validate.validateGender(gender);
    await validate.validateUserType(userType);

    const newUser = await userData.createUser(name, email, password, gender, age, userType);
    if (newUser.userInserted) {
      return res.redirect("/#about");
    }
  } catch (e) {
    return res.status(e.b || 500).render("users/signup", {
      title: "Signup Page",
      error: e || "Internal Server Error",
      hasErrors: true,
      notLoggedIn: req.session.user ? false : true
    });
  }
});


router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  var course_i = await courses.getAllCourses()
  if(!req.session.user_type){
    req.session.user_type = {type: 0}
  }

  try {
    await validate.validateEmail(email);
    await validate.validatePassword(password);

    const existingUser = await userData.checkUser(email,password);
    if (existingUser) {

      const user_info = await userData.getUser(email);
      req.session.user = { email: user_info.email };
      req.session.user_type = {type: user_info.userType};
      return res.redirect("/userPage");
    } else {
      res.render("users/index", {
        title: "Login Page",
        error: "Either the email or password is invalid",
        hasErrors: true,
        notLoggedIn: req.session.user ? false : true,
        course_info: JSON.stringify(course_i),
        userType: req.session.user_type.type
      });
      return;
    }
  } catch (e) {
    res.status(500).render("users/index", {
      title: "Login Page",
      error: e,
      hasErrors: true,
      notLoggedIn: req.session.user ? false : true,
      course_info: JSON.stringify(course_i),
      userType: req.session.user_type.type
    });
    return;
  }
});


router.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.render("users/logout",  { title: "Logged out", notLoggedIn: false, location: crossPageNavs });
});

// VIDEOS ROUTES

// const validation = require('../tasks/validation')

router.get('/video/:course', async(req,res) => {
    // console.log(req.params)
    if(req.params){
      var course_name = req.params.course
    }
    else{
      var course_name = "Web Development"
    }
    let email = req.session.user.email
    // console.log(course_name)
    // let email = 'pjhangl1@stevens.edu'
    // console.log(req)
    try{
      var data = await videos.getVideos(email,course_name);
    }
    catch(e){
      console.log(e)
    }
    // console.log(data);
    // res.locals.videodata = JSON.stringify(data)
    // console.log(res.locals.videodata)
    return res.render('edu/video',{videodata : JSON.stringify(data), location: crossPageNavs, notLoggedIn: req.session.user ? false : true});
})
router.get('/courseForm',async(req,res)=>{
     res.render('edu/addCourseForm', {notLoggedIn: req.session.user ? false : true, location: crossPageNavs})
})
router.get('/allCourses',async(req,res)=>{
    let email = req.session.user.email
    let courseList = await courses.getInstCourses(email);
    if (req.session.user){
      if(req.session.user_type.type === 1)
        var user_type = 1
      else
        var user_type = 0
    }
    res.render('edu/coursesPage',{data:courseList, notLoggedIn: req.session.user ? false : true, user_type:user_type, location: crossPageNavs})
})
router.get('/viewAllCourses',async(req,res)=>{
  let courseList = await courses.getAllCourses();
  return res.render('edu/allCoursesPage',{data:courseList, notLoggedIn: req.session.user ? false : true, location: crossPageNavs, search: false})
})
router.post('/delete/:_id',async(req,res)=>{
    let flag = await courses.deleteCourse(req.params._id);
    if(flag)res.redirect('/allCourses');
})
router.get('/course/:Name', async(req,res) => {
    // let course=await courses.getCourseById(req.params._id);
    // console.log(req.params.Name)
    try{
      let course = await courses.getCourseByName(req.params.Name)
      let len = course.reviews.length<=0 ? -1 : course.reviews.length;
      let comments = [];
      let flag = false;
      if(len>0){
        for(let i=0; i<len; i++){
          let tempUser = await userData.getUserById(`${course.reviews[i].userId}`);
          comments[i] = {name: tempUser.name, rat: course.reviews[i].rating, txt: course.reviews[i].text}
        }
      }else{
        flag = true;
      }
      res.render('edu/courseContent',{data:JSON.stringify(course), flag: flag, comments:comments, notLoggedIn: req.session.user ? false : true, location: crossPageNavs });
    }catch(e){
      console.log(e);
    }
  })
router.post('/course/:Name', async(req,res) => {
    try{
      let email = req.session.user.email
      let user = await userData.getUser(email);
      let uname = user.name;
      let courseName = req.params.Name;
      let text = req.body.text;
      let rating = req.body.rating;
      let course = await courses.getCourseByName(courseName);
  
      let udatedcourse = await courses.addReview(course._id, user._id, text, rating);
      res.send({name:uname});
    }catch(e){
      console.log(e);
    }
})

router.post('/courseForm', async(req,res) => {
  // console.log(req.body)
  var email = req.session.user.email
  try{
    validate.validateEmail(email)
  }
  catch(e){
    console.log(e)
  }
  if(req.body.image){
    var image_link = req.body.image
  }
  else{
    image_link = "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
  }
  try{
    let courseAdded=await courses.addCourse(req.body.courseName,req.body.description, image_link, req.body.video_id, email);
    if(courseAdded.courseInserted)  
    // res.redirect('/allCourses');
    res.jsonp({success:true})
  }catch(e){
    res.jsonp({error:e})
  }
})

router.post('/modify', async(req,res) => {
  // console.log(req.body)
  var email = req.session.user.email
  try{
    validate.validateEmail(email)
  }
  catch(e){
    console.log(e)
  }
  // console.log(req.body)
  // var data = {}
  // if(req.body.courseName.trim()){
  //   data.courseName = req.body.courseName.trim()
  // }
  // if(req.body.description.trim()){
  //   data.description = req.body.description.trim()
  // }
  // if(req.body.image.trim()){
  //   data.image = req.body.image.trim()
  // }
  // if(Array.isArray(req.body.video_id) && req.body.video_id.length > 0){
  //   data.video_id = req.body.video_id
  // }
  let course_modify = await courses.modifyCourse(req.body)
  if(course_modify.Modified){
    res.redirect('/allCourses');
  }
  // let courseAdded=await courses.addCourse(req.body.courseName,req.body.description, image_link, req.body.video_id, email);
  // if(courseAdded.courseInserted)  
  // res.redirect('/allCourses');
})

router.post('/video', async(req,res) => {
    // console.log("post")
    // console.log(req.body)
    // let timeupdated = await videos.addtime(id = req.body.video_id, time = req.body.resume)
    let email = req.session.user.email
    email = email.trim();
    email = email.toLowerCase();
    let timeupdated = await videos.addtime(email,req.body)
    if (!timeupdated.TimeUpdated){
        console.log("Updation Failed")
    }
    else{
        // console.log("Updated")
    }
})

router.get('/progress', async(req, res) => {
    let data = await videos.getprogress();
    return res.render('edu/progress',{videodata : JSON.stringify(data), notLoggedIn: req.session.user ? false : true, location: crossPageNavs});
})

router.post("/enroll", async(req,res) => {
  // console.log("In Route")
  // console.log(req.body)
  let course_name = req.body.course_name
  let email = req.session.user.email
  // console.log("In Enroll")
  // console.log([course_name,email])
  try {
    await userData.enroll(email,course_name)
    // res.send('_callback(\'{"message": "Enrolled"}\')');
    res.send({message:"Enrolled"})
  } catch(e) {
    // console.log(e);
    if (e === 'Already Enrolled')
      // res.send('_callback(\'{"message": "Already Enrolled"}\')');
      res.send({message:"Already Enrolled."})

  } 
  return;
})



module.exports = router;
