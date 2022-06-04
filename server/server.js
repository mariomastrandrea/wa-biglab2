const express = require('express');
const filmAPI = require("./api/FilmAPI");
const cors = require("cors");
const morgan = require("morgan");

//User DAO
const getUserDAOInstance = require("./dao/UserDAO");
const userDAO = getUserDAOInstance();

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const PORT = 3001;
app = new express();
app.use(morgan('dev'));
app.use(express.json());

const corsOptions = {
   origin: 'http://localhost:3000',
   optionsSuccessStatus: 200,
   credentials: true,
}

app.use(cors(corsOptions));

// #region - Authentication 

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
   const user = await userDAO.getUser(username, password);

   if (!user)
      return cb(null, false, 'Incorrect username or password');

   return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
   cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
   return cb(null, user);
   // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

app.use(session({
   secret: "this is the secret of frontend enjoyers",
   resave: false,
   saveUninitialized: false,
}));

app.use(passport.authenticate('session'));
// #endregion

// #region - Authentication routes
// * create a new user session *
app.post('/api/login', function (req, res, next) {
   passport.authenticate('local', (err, user, info) => {
      if (err)
         return next(err);

      if (!user) {
         // display wrong login messages
         return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
         if (err)
            return next(err);

         // req.user contains the authenticated user, we send all the user info back
         return res.status(201).json(req.user);
      });
   })(req, res, next);
});

// * delete user session *
app.delete('/api/logout', (req, res) => {
   req.logout(() => {
      res.end();
   });
});

app.get('/api/sessions/current', (req, res) => {
   if (req.isAuthenticated())
      return res.status(200).json(req.user);
   else
      return res.status(401).json({ err: 'Unauthorized' });
});
// #endregion

// define Film router
app.use("/api/films", filmAPI);

// start the server
app.listen(PORT, () =>
   console.log(`Server running on http://localhost:${PORT}/`));