const express = require('express');
const router = express.Router();
const data = require('../data');
const testData = data.tests;


router.get('/', async (req, res) => {
    try {
        console.log('asd');
        const allTests = await testData.getAll();
        res.status(200).json(allTests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    const createResData = req.body;
    try {
        const { name, question, answer1, answer2, answer3, answer4 } = createResData;
        try {
            if (!name) throw 'All fields need to have valid values';
    
    if (typeof name !== 'string') throw 'Name must be a string';
    
   
        } catch (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        const newTest = await testData.create(name);
        res.status(200).json(newTest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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
            const getRes = await testData.get(req.params.id);
            res.status(200).json(getRes);
        } catch (error) {
            if (error.message === "Error in id. No band with the given id") {
                res.status(404).json({ error: `No band with the given id` });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    });
});



 

module.exports = router;

