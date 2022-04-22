const user = require('./videos');

const constructorMethod = (app) => {
    app.use('/', user)

};

module.exports = constructorMethod;
