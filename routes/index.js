const userRoutes = require('./users');
const courseRoutes = require('./courses');

const constructorMethod = (app) => {
    app.use('/', userRoutes);
    // app.use('/course', courseRoutes);
    app.use('*', (req, res) => {
      res.status(404).send("Page not found");
    });

};
module.exports = constructorMethod;
