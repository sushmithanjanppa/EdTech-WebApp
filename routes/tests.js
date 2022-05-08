const express = require('express');
const { tests } = require('../data');
const router = express.Router();
const data = require('../data');
const courseData = data.courses;
const user = require("../data/users")


router.get('/', async (req, res) => {
    if(req.session.user){
    try {
        // console.log('asd');
        const allCourses = await user.get_user_courses(req.session.user.email);
        res.status(200).render('tests/testIndex', { title: `course`, course: allCourses.courses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }
    else res.status(400).json({error:"Login to view test."})
});

router.post('/', async (req, res) => {
    const createResData = req.body;
    try {
        const { courseName, branch, description, videos, question, answer1, answer2, answer3, answer4 } = createResData;
        try {
            if (!courseName) throw 'All fields need to have valid values';
            if (!branch) throw 'All fields need to have valid values';

            if (typeof courseName !== 'string') throw 'Name must be a string';
            if (typeof branch !== 'string') throw 'Name must be a string';


        } catch (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        const newCourse = await courseData.addCourse(courseName, branch, description, videos);
        res.status(200).json(newCourse);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            res.status(400).json({ error: `id must be passed` });
            return;
        }
        if (typeof req.params.id != 'string' || req.params.id.trim() === '') {
            res.status(400).json({ error: `id must be valid` });
            return;
        }
        const getRes = await courseData.getCourseById(req.params.id);
        len= getRes.questions.length
        let resArr=[]
        for(var i=0; i<len;i++){
            resArr =  getRes.questions

        }
        let correct_Answer = []
        for(var i=0; i < resArr.length; i++) 
        {
            
            correct_Answer[i] = String(resArr[i].answer)
        }
       
        console.log(correct_Answer)

        res.render('tests/questions', { title: getRes.name, questions: getRes.questions, qlength:len, solution:JSON.stringify(correct_Answer) });
    } catch (error) {
        if (error.message === "Error in id. No course with the given id") {
            res.status(404).json({ error: `No course with the given id` });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});








module.exports = router;

