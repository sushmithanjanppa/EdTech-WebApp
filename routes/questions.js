const express = require('express');
const router = express.Router();
const data = require('../data');
const questionData = data.questions;

router.post('/:id', async (req, res) => {
    const createQuestionData = req.body;
    try {
        if (!req.params.id) {
            res.status(400).json({ error: `bandId must be passed` });
            return;
        }
        if (typeof req.params.id != 'string' || req.params.id.trim() === '') {
            res.status(400).json({ error: `bandId must be valid` });
            return;
        }

        const {question, answer1, answer2, answer3, answer4 } = createQuestionData;
        try {
            if (!question) throw 'All fields need to have valid values';
            if (!answer1) throw 'All fields need to have valid values';
            if (!answer2) throw 'All fields need to have valid values';
            if (!answer3) throw 'All fields need to have valid values';
            if (!answer4) throw 'All fields need to have valid values';
    
            if (typeof question !== 'string') throw 'question must be a string';
            if (typeof answer1 !== 'string') throw 'answer1 must be a string';
            if (typeof answer2 !== 'string') throw 'answer2 must be a string';
            if (typeof answer3 !== 'string') throw 'answer3 must be a string';
            if (typeof answer4 !== 'string') throw 'answer4 must be a string';
            if (answer1.trim() === '') throw 'answer1 must be a string';
            if (answer2.trim() === '') throw 'answer2 must be a string';
            if (answer3.trim() === '') throw 'answer3 must be a string';
            if (answer4.trim() === '') throw 'answer4 must be a string';
        } catch (error) {
            res.status(400).json({ error: error.message });
            return;
        }

        const newQuestion= await questionData.create(req.params.id, createQuestionData.question, createQuestionData.answer1, createQuestionData.answer2, createQuestionData.answer3, createQuestionData.answer4);
        res.json(newQuestion);
    } catch (error) {
        if (error.message.includes("Unable to find question")) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});
module.exports = router;