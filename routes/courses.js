const express = require("express");
const router = express.Router();

  const crossPageNavs = {
    top: "/#top",
    about: "/#about",
    courses: "/#courses",
    reviews: "/#reviews",
  };

router.get("/1", async (req, res) => {
    res.render("courses/course1web", {
      title: "course1web",
      location: crossPageNavs,
    });
    return;
});
  
router.get("/2", async (req, res) => {
    res.render("courses/course2", { title: "course2", location: crossPageNavs });
    return;
});
  
router.get("/3", async (req, res) => {
    res.render("courses/course3", { title: "course3", location: crossPageNavs });
    return;
});

module.exports = router;