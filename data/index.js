const videos = require('./videos');
const courses=require('./courses');
const userData=require('./users');


const questionData = require('./questions');

module.exports = {
    videos: videos,
    courses:courses,
    questions: questionData,
    users: userData
};