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
  if (req.session.user) {
    return res.redirect("/private");
  } else {
    res.render("users/index", { title: "Login Page", location: samePageNavs });
  }
});

router.get("/signup", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/login");
  } else {
    res.render("users/signup", { title: "Signup Page" });
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
      req.session.user = { email: req.body.email };
      res.redirect("/userPage");
      return;
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
  return res.render("users/logout", { title: "Logged out" });
});

// VIDEOS ROUTES

// const validation = require('../tasks/validation')

router.get('/video', async(req,res) => {
    let data = await videos.getVideos();
    // console.log(data);
    // res.locals.videodata = JSON.stringify(data)
    // console.log(res.locals.videodata)
    return res.render('edu/video',{videodata : JSON.stringify(data)});
})
router.get('/courseForm',async(req,res)=>{
     res.render('edu/addCourseForm')
})
router.get('/allCourses',async(req,res)=>{
    let courseList = await courses.getAllCourses();
    res.render('edu/coursesPage',{data:courseList})
})
router.post('/delete/:_id',async(req,res)=>{
    let flag = await courses.deleteCourse(req.params._id);
    if(flag)res.redirect('/allCourses');
})
router.get('/courses/:_id', async(req,res) => {
    let course=await courses.getCourseById(req.params._id);
    res.render('edu/courseContent',{data:course });
  })
router.post('/courseForm', async(req,res) => {
  let courseAdded=await courses.addCourse(req.body.courseName,req.body.description);
  if(courseAdded.courseInserted)  
  res.redirect('/allCourses');
})
router.post('/video', async(req,res) => {
    // console.log("post")
    // console.log(req.body)
    // let timeupdated = await videos.addtime(id = req.body.video_id, time = req.body.resume)
    let timeupdated = await videos.addtime(req.body)
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



module.exports = router;
