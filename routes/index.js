const userRoutes = require('./users');
const testRoutes = require('./tests');
const questionRoutes = require('./questions');
const searchRoutes = require('./search');
const filterRoutes = require('./filter');


// const courseRoutes = require('./courses');

const userPageRoutes = require('./userPage');

const constructorMethod = (app) => {

  app.use('/search', searchRoutes);
    app.use('/', userRoutes);
    app.use('/questions', questionRoutes);
    app.use('/tests', testRoutes);
    app.use('/filter', filterRoutes);
    app.use('/userPage', userPageRoutes);

    // app.use('/course', courseRoutes);
    app.use('/course', userRoutes);

    app.use('*', (req, res) => {
      res.status(404).render("users/404");
    });

};
module.exports = constructorMethod;
