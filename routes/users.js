const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const videos = require('../data/videos');
const courses = require('../data/courses');
const validate = require('../validation/userValidate');

const samePageNavs = {
  top: "#top",
  about: "#about",
  courses: "#courses",
  reviews: "#reviews",
};
const crossPageNavs = {
  top: "/#top",
  about: "/#about",
  courses: "/#courses",
  reviews: "/#reviews",
};


// USER ROUTES
router.get("/", async (req, res) => {
  var course_i = await courses.getAllCourses()
  // console.log(course_i)
  if(!req.session.user_type){
    req.session.user_type = {type: 0}
  }
  res.render("users/index", { title: "Login Page", location: samePageNavs, notLoggedIn: req.session.user ? false : true, course_info:JSON.stringify(course_i) , userType: req.session.user_type.type});
});

router.get("/signup", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/login");
  } else {
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
      return res.redirect("/");
    }
  } catch (e) {
    return res.status(e.b || 500).render("users/signup", {
      title: "Signup Page",
      error: e || "Internal Server Error",
      hasErrors: true,
    });
  }
});


router.post("/login", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

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
      });
      return;
    }
  } catch (e) {
    res.status(500).render("users/index", {
      title: "Login Page",
      error: e,
      hasErrors: true,
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

router.get('/video', async(req,res) => {
    if(req.body.data){
      var course_name = req.body.data
    }
    else{
      var course_name = "Web Development"
    }
    let email = req.session.user.email
    // console.log(req)
    let data = await videos.getVideos(email,course_name);
    // console.log(data);
    // res.locals.videodata = JSON.stringify(data)
    // console.log(res.locals.videodata)
    return res.render('edu/video',{videodata : JSON.stringify(data), location: crossPageNavs, notLoggedIn: req.session.user ? false : true});
})
router.get('/courseForm',async(req,res)=>{
     res.render('edu/addCourseForm', {notLoggedIn: req.session.user ? false : true, location: crossPageNavs})
})
router.get('/allCourses',async(req,res)=>{
    let courseList = await courses.getAllCourses();
    res.render('edu/coursesPage',{data:courseList, notLoggedIn: req.session.user ? false : true, location: crossPageNavs})
})
router.get('/viewAllCourses',async(req,res)=>{
  let courseList = await courses.getAllCourses();
  return res.render('edu/allCoursesPage',{data:courseList, notLoggedIn: req.session.user ? false : true, location: crossPageNavs})
})
router.post('/delete/:_id',async(req,res)=>{
    let flag = await courses.deleteCourse(req.params._id);
    if(flag)res.redirect('/allCourses');
})
router.get('/course/:Name', async(req,res) => {
    // let course=await courses.getCourseById(req.params._id);
    // console.log(req.params.Name)
    let course = await courses.getCourseByName(req.params.Name)
    res.render('edu/courseContent',{data:JSON.stringify(course), notLoggedIn: req.session.user ? false : true, location: crossPageNavs });
  })
router.post('/courseForm', async(req,res) => {
  console.log(req.body)
  if(req.body.image){
    var image_link = req.body.image
  }
  else{
    image_link = "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
  }
  let courseAdded=await courses.addCourse(req.body.courseName,req.body.description, image_link, req.body.video_id);
  if(courseAdded.courseInserted)  
  res.redirect('/allCourses');
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
        console.log("Updated")
    }
})

router.get('/progress', async(req, res) => {
    let data = await videos.getprogress();
    return res.render('edu/progress',{videodata : JSON.stringify(data), notLoggedIn: req.session.user ? false : true, location: crossPageNavs});
})

router.post("/enroll", async(req,res) => {
  let course_name = req.body.Data
  let email = req.session.user.email
  // console.log("In Enroll")
  // console.log([course_name,email])
  try {
    await userData.enroll(email,course_name)

  } catch(e) {
    // console.log(e);

  } 
  return;
})



module.exports = router;
