const express = require('express');
const router = express.Router();
const data = require('../data');
const courseData = data.courses;

const crossPageNavs = {
    top: "/#top",
    about: "/#about",
    courses: "/#courses",
    reviews: "/#reviews",
    team: "/#team"
  };  

router.get('/', async (req, res) => {
    res.render('edu/filterIndex', { title: `Select you Branch` });
});

router.get('/filter/:key', async (req, res) => {
    
    let result = await courseData.getfilterByBranch(req.params.key.toUpperCase());
    // console.log(result, " ======= ", req.params.key)
    let resultArr = [];
    for (let i = 0; i < result.length ; i++) {
        resultArr.push(result[i]);
        
    }
    let error = '';
    let hasError = false;
    if (!result) {
        hasError = true;
        error = `No courses found for the given id ${req.params.id}`
        return res.status(404).json({ error: error });
    }
    
    res.render('edu/filter', { title: 'Courses' , data: resultArr, filterSearchTerm: req.params.key, error: error, hasError: hasError, location: crossPageNavs });
});


router.get('/course/:id', async (req, res) => {
    if (!req.params.id && req.params.id.trim() === '') {
        return res.status(400).json({ status: 400, error: `Invalid id`, home: "http://localhost:3000" });
    }
    let result = await courseData.get(req.params.id);
    let error = '';
    let hasError = false;
    if (!result) {
        hasError = true;
        error = `No courses found for the given id ${req.params.id}`
        return res.status(404).json({ error: error });
    }
    
    res.render('edu/courseContent', { title: result.name, data: result, error: error, hasError: hasError, location: crossPageNavs });
});

module.exports = router;
