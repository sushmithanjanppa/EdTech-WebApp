const user = require('./videos');
const questionRoutes = require('./questions');

const constructorMethod = (app) => {
    app.use('/', user)
    app.use('/questions', questionRoutes);

};

module.exports = constructorMethod;
