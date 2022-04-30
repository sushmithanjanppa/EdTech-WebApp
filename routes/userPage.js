const express = require("express");
const router = express.Router();
const userData = require("../data/users");
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

router.get('/', async (req, res) => {
    try{
      if(req.session.user){
        let uemail = req.session.user.email;
        const userInfo = await userData.getUser(uemail);
        res.render("users/userPage",{data: userInfo ,title: "Profile", location: crossPageNavs});
      }
    }catch(e){
      res.status(400).render('users/index', {error: e});
    }
});

module.exports = router;