const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
// app.get('/private', async (req,res, next) =>{
//     if(!req.session.user){
//         return res.status(403).render("login/error", {error: "You are not logged in.", user:false})
//     }
//     else{
//         next();
//     }
// })

// app.use('/private', (req, res, next) => {
//     // console.log(req.session.id);
//     if (!req.session.user) {
//         return res.redirect('/');
//     } else {
//         next();
//     }
// });

// app.use('/course', async (req, res, next) => {
//     if (req.session.user) {
//         return res.redirect('/private');
//     } else {
//       //here I',m just manually setting the req.method to post since it's usually coming from a form
//         // return res.redirect('/');
//         next();
//     }
// });

// app.use('/', async (req, res, next) => {
//     if (req.session.user) {
//         return res.redirect('/private');
//     } else {
//       //here I',m just manually setting the req.method to post since it's usually coming from a form
//         // return res.redirect('/');
//         next();
//     }
// });

// app.use('/signup', async (req, res, next) => {
//     if (req.session.user) {
//         return res.redirect('/private');
//     } else {
//         //here I',m just manually setting the req.method to post since it's usually coming from a form
//         // return res.redirect('/');
//         next();
// }});

const handlebarsInstance = exphbs.create({
    defaultLayout: "main",
  
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === "number")
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
        return new Handlebars.SafeString(JSON.stringify(obj));
      },
    },
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
next();
};

app.use;
app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))

//Authentication Middleware
app.use('/userPage', (req, res, next) => {
  if(req.session.user){
    next();
  }else{
    res.status(403).render('users/authError');
  }
});

app.use('/login', (req, res, next) => {
  if (req.session.user) {
    return res.redirect('users/userPage');
  } else {
    req.method = 'POST';
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
