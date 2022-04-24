const user = require('./videos');
const testRoutes = require('./tests');
const questionRoutes = require('./questions');

const constructorMethod = (app) => {
    app.use('/', user)
    app.use('/tests', testRoutes);
    app.use('/questions', questionRoutes);

};

module.exports = constructorMethod;
