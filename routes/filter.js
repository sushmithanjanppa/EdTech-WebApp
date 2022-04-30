const express = require('express');
const router = express.Router();
const data = require('../data');
const courseData = data.courses;

router.get('/filter/:key', async (req, res) => {

    
    let result = await courseData.getfilterByBranch(req.params.key);
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
    
    res.render('edu/filter', { title: 'Courses' , data: resultArr, filterSearchTerm: req.params.key, error: error, hasError: hasError });
});

module.exports = router;
