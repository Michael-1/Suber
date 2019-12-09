const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { FirestoreStore } = require("@google-cloud/connect-firestore");
const argon2 = require("argon2");
const { database } = require("./db");
require("dotenv").config();

const YEAR = 1000 * 60 * 60 * 24 * 365.2425;
const session = expressSession({
  store: new FirestoreStore({
    dataset: database
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    maxAge: YEAR,
    secure: process.env.NODE_ENV === "development" ? false : true
  },
  saveUninitialized: false
});

passport.use(
  new LocalStrategy((email, password, done) => {
    const startTime = new Date();
    database
      .collection("User")
      .where("email", "==", email)
      .get()
      .then(function(snapshot) {
        if (snapshot.empty) return invalidCredentials(done, startTime);
        const user = snapshot.docs[0];
        argon2.verify(user.get("password"), password).then(function(same) {
          if (same) return done(null, user.id);
          return invalidCredentials(done, startTime);
        });
      });
  })
);
function invalidCredentials(done, startTime) {
  setTimeout(function() {
    return done(null, false);
  }, startTime - new Date() + 5000);
}
passport.serializeUser((userId, done) => {
  done(null, userId);
});
passport.deserializeUser((userId, done) => {
  done(null, userId);
});

const authenticate = function(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (info) return res.status(401).send(info.message);
    if (err) {
      return next(err);
      console.error(err);
    }
    if (!user) return res.sendStatus(401);
    req.login(user, err => {
      return res.sendStatus(204);
    });
  })(req, res, next);
};

function isAuthentic(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.sendStatus(401);
}

module.exports = {
  session,
  passport,
  authenticate,
  isAuthentic
};
