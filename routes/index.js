const userRoutes = require('./users');
const testRoutes = require('./tests');
const questionRoutes = require('./questions');
const searchRoutes = require('./search');
const filterRoutes = require('./filter');

const constructorMethod = (app) => {

  app.use('/search', searchRoutes);
    app.use('/', userRoutes);
    app.use('/questions', questionRoutes);
    app.use('/tests', testRoutes);
    app.use('/filter', filterRoutes);
    app.use('*', (req, res) => {
      res.status(404).send("Page not found");
    });

};
module.exports = constructorMethod;
