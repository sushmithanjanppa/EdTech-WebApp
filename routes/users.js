const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const { user } = require("../config/mongoCollection");
const connection = require("../config/mongoConnection");
const emailValidate = require('email-validator')
const data = require("../data");
const videos = require('../data/videos')
const courses = require('../data/courses')

const ud = data.users;
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
    return res.redirect("/private");
  } else {
    res.render("users/signup", { title: "Signup Page" });
  }
});

router.post("/signup", async (req, res) => {
  name= req.body.name;
  email = req.body.email;
  password = req.body.password;

  if (!name) {
    res.status(400).render("users/signup", {
      title: "Signup Page",
      error: "Please enter a valid input for name",
      hasErrors: true,
    });
    return;
  }

  if (!email) {
    res.status(400).render("users/signup", {
      title: "Signup Page",
      error: "Please enter a valid input for email",
      hasErrors: true,
    });
    return;
  }

  if (!password) {
    res.status(400).render("users/signup", {
      title: "Signup Page",
      error: "Please enter a valid input for password",
      hasErrors: true,
    });
    return;
  }
  
  if (typeof name !== "string" ||typeof email !== "string" || typeof password !== "string") {
    res.status(400).render("users/signup", {
      title: "Signup Page",
      error: "UserName and password both should be string",
      hasErrors: true,
    });
    return;
  }

  // if (email.length < 4) {
  //     res.status(400).render("users/signup", {title:"Signup Page",
  //       error: "Enter username with length of more than 4 characters.",
  //       hasErrors: true
  //     });
  //     return;
  // }

  if (password.length < 6) {
    res.status(400).render("users/signup", {
      title: "Signup Page",
      error: "The minimum length of password should be atleast 6.",
      hasErrors: true,
    });
    return;
  }

  // if (username.match(/^[\s]*$/gi)) {
  //     res.status(400).render("users/signup", {title:"Signup Page",
  //       error: "Do not enter blank spaces",
  //       hasErrors: true
  //     });
  //     return;
  // }

  if (password.match(/^[\s]*$/gi)) {
    res.status(400).render("users/signup", {
      title: "Signup Page",
      error: "Do not enter blank spaces",
      hasErrors: true,
    });
    return;
  }

  //   username = username.trim();
  // let userValidate = /^[a-zA-Z0-9]+$/gi;
  // if (!username.match(userValidate)) {
  //   res.status(400).render("users/signup", {title:"Signup Page",
  //     error:
  //       "The Username should be valid and should only contain alphanumeric characters",
  //       hasErrors: true
  //   });
  //   return;
  // }

  email = email.trim();
  
  if (!emailValidate.validate(email)) {
    res.status(400).render("users/signup", {
      title: "Signup Page",
      error: "The email should be valid",
      hasErrors: true,
    });
    return;
  }

  try {
    const p = await ud.createUser(name, email, password);
    if (p.userInserted) {
      return res.redirect("/");
    }
  } catch (e) {
    
    return res.status(e.b || 500).render("users/signup", {
      title: "Signup Page",
      error: e.message || "Internal Server Error",
      hasErrors: true,
    });
  }
});

router.post("/login", async (req, res) => {
  // name= req.body.name;
  email = req.body.email;
  password = req.body.password;

  // if (!name) {
  //   res.status(400).render("users/login", {
  //     title: "Login Page",
  //     error: "Please enter a valid input for name",
  //     hasErrors: true,
  //   });
  //   return;
  // }

  if (!email) {
    res.status(400).render("users/index", {
      title: "Login Page",
      error: "Please enter a valid input for email",
      hasErrors: true,
    });
    return;
  }
  if (!password) {
    res.status(400).render("users/index", {
      title: "Login Page",
      error: "Please enter a valid input for password",
      hasErrors: true,
    });
    return;
  }

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).render("users/index", {
      title: "Login Page",
      error: "UserName and password both should be string",
      hasErrors: true,
    });
    return;
  }

  // if (username.length < 4) {
  //   res.status(400).render("users/index", {title:"Login Page",
  //     error: "Enter username with length of more than 4 characters.",
  //     hasErrors: true
  //   });
  //   return;
  // }

  if (password.length < 6) {
    res.status(400).render("users/index", {
      title: "Login Page",
      error: "The minimum length of password should be atleast 6.",
      hasErrors: true,
    });
    return;
  }

  // if (username.match(/^[\s]*$/gi)) {
  //   res.status(400).render("users/index", {title:"Login Page",
  //     error: "Do not enter blank spaces",
  //     hasErrors: true
  //   });
  //   return;
  // }

  if (password.match(/^[\s]*$/gi)) {
    res.status(400).render("users/index", {
      title: "Login Page",
      error: "Do not enter blank spaces",
      hasErrors: true,
    });
    return;
  }

  
  if (!emailValidate.validate(email)){
    res.status(400).render("users/index", {
      title: "Login Page",
      error: "The email should be valid for login",
      hasErrors: true,
    });
    return;
  }

  try {
    let xyz = await ud.checkUser(email, password);

    if (xyz) {
      req.session.user = { email: username };
      res.redirect("/index");
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

// router.get("/private", async (req, res) => {
//   res.render("users/index", {
//     title: "Private Page",
//     email: req.session.user.username,
//     hasErrors: false,
//   });
//   return;
// });

router.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.render("users/logout", { title: "Logged out" });
});

router.get("/course1web", async (req, res) => {
  res.render("users/course1web", {
    title: "course1web",
    location: crossPageNavs,
  });
  return;
});

router.get("/course2", async (req, res) => {
  res.render("users/course2", { title: "course2", location: crossPageNavs });
  return;
});

router.get("/course3", async (req, res) => {
  res.render("users/course3", { title: "course3", location: crossPageNavs });
  return;
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



module.exports = router;
