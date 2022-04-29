const userRoutes = require('./users');
const questionRoutes = require('./questions');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    app.use('/questions', questionRoutes);
    app.use('*', (req, res) => {
      res.status(404).send("Page not found");
    });

};
module.exports = constructorMethod;
