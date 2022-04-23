const express = require('express');
const app = express();
const session = require('express-session');
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// app.use(session({
//     name: 'AuthCookie',
//     secret: 'some secret string!',
//     resave: false,
//     saveUninitialized: true
// }))

// app.use(async (req, res, next) => {
//         console.log("[%s]: %s %s (%s)", 
//         new Date().toUTCString(), 
//         req.method,
//         req.originalUrl,
//         `${(req.session.user) ? "Authenticated User": "Non-Authentiated User"}`)
//         next();
    
// })



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

app.use('/course', async (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/private');
    } else {
      //here I',m just manually setting the req.method to post since it's usually coming from a form
        // return res.redirect('/');
        next();
    }
});

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

app.use;
app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "some  secret  string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/private", (req, res, next) => {
    if (!req.session.user) {
      return res.status(403).render("users/private", { title:"Private Page", error: "Sorry you are not authenticated, please login first !", hasErrors: true });
    } else {
      next();
    }
});


let logMiddleware = function (req, res, next) {
    let CurrenttimeStamp = new Date().toUTCString();
  
    let RequestMethod = req.method;
  
    let RequestRoute = req.originalUrl;
    if (!req.session.user) {
      console.log(
        "[" +
          CurrenttimeStamp +
          "]: " +
          RequestMethod +
          " " +
          RequestRoute +
          " Non-Authenticated User"
      );
    } else {
      console.log(
        "[" +
          CurrenttimeStamp +
          "]: " +
          RequestMethod +
          " " +
          RequestRoute +
          " Authenticated User"
      );
    }
    next();
};

app.use(logMiddleware);
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
