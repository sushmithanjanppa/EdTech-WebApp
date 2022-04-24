const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const session = require("express-session");
const { user } = require("../config/mongoCollections");
const connection = require("../config/mongoConnections");
const emailValidate = require('email-validator')
const data = require("../data");
const { courses } = require("../data");
const ud = data.users;
const courses1 = data.courses;

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
  name= req.body.name;
  email = req.body.email;
  password = req.body.password;

  if (!name) {
    res.status(400).render("users/login", {
      title: "Login Page",
      error: "Please enter a valid input for name",
      hasErrors: true,
    });
    return;
  }

  if (!email) {
    res.status(400).render("users/login", {
      title: "Login Page",
      error: "Please enter a valid input for email",
      hasErrors: true,
    });
    return;
  }
  if (!password) {
    res.status(400).render("users/login", {
      title: "Login Page",
      error: "Please enter a valid input for password",
      hasErrors: true,
    });
    return;
  }

  if (typeof name !== "string" ||typeof email !== "string" || typeof password !== "string") {
    res.status(400).render("users/login", {
      title: "Login Page",
      error: "UserName and password both should be string",
      hasErrors: true,
    });
    return;
  }

  // if (username.length < 4) {
  //   res.status(400).render("users/login", {title:"Login Page",
  //     error: "Enter username with length of more than 4 characters.",
  //     hasErrors: true
  //   });
  //   return;
  // }

  if (password.length < 6) {
    res.status(400).render("users/login", {
      title: "Login Page",
      error: "The minimum length of password should be atleast 6.",
      hasErrors: true,
    });
    return;
  }

  // if (username.match(/^[\s]*$/gi)) {
  //   res.status(400).render("users/login", {title:"Login Page",
  //     error: "Do not enter blank spaces",
  //     hasErrors: true
  //   });
  //   return;
  // }

  if (password.match(/^[\s]*$/gi)) {
    res.status(400).render("users/login", {
      title: "Login Page",
      error: "Do not enter blank spaces",
      hasErrors: true,
    });
    return;
  }

  
  if (!emailValidate.validate(email)){
    res.status(400).render("users/login", {
      title: "Login Page",
      error: "The email should be valid for login",
      hasErrors: true,
    });
    return;
  }

  try {
    let xyz = await ud.checkUser(name, email, password);

    if (xyz) {
      req.session.user = { email: username };
      res.redirect("/index");
      return;
    } else {
      res.render("users/login", {
        title: "Login Page",
        error: "Either the email or password is invalid",
        hasErrors: true,
      });
      return;
    }
  } catch (e) {
    res.status(500).render("users/login", {
      title: "Login Page",
      error: e,
      hasErrors: true,
    });
    return;
  }
});

router.get("/private", async (req, res) => {
  res.render("users/index", {
    title: "Private Page",
    email: req.session.user.username,
    hasErrors: false,
  });
  return;
});

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


router.post('/searchcourses', async (req, res) => {
  let bodyData = req.body;
  if (!bodyData.courseSearchTerm || bodyData.courseSearchTerm.trim() === '') {
      return res.status(400).json({ status: 400, error: `No search term provided.`, home: "http://localhost:3000" });
  }
  let result = await courses1.getcourse(bodyData.courseCourseTerm);
  let resultArr = [];
  for (let i = 0; i < result.length; i++) {
      resultArr.push(result[i]);
  }
  let error = '';
  let hasError = false;
  if (result.length == 0) {
      hasError = true;
      error = `We're sorry, but no results were found for ${bodyData.courseSearchTerm}.`
  }
  res.render('users/search', { title: `Coursess Found`, data: resultArr, courseSearchTerm: bodyData.courseSearchTerm, error: error, hasError: hasError });
});


module.exports = router;


