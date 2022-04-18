const expressSession = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { FirestoreStore } = require("@google-cloud/connect-firestore");
const argon2 = require("argon2");
const { database, userCollection } = require("./db");

const YEAR = 1000 * 60 * 60 * 24 * 365.2425;
const session = expressSession({
  store: new FirestoreStore({
    dataset: database,
  }),
  name: "__session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: {
    maxAge: YEAR,
    secure: process.env.NODE_ENV === "development" ? false : true,
  },
  saveUninitialized: false,
});

passport.use(
  new LocalStrategy((email, password, done) => {
    const startTime = new Date();
    userCollection
      .where("email", "==", email)
      .where("status", "==", "active")
      .get()
      .then(function (snapshot) {
        if (snapshot.empty) return invalidCredentials(done, startTime);
        const user = snapshot.docs[0];
        var start = new Date();
        argon2.verify(user.get("password"), password).then(function (same) {
          console.debug(`Argon2 runtime: ${new Date() - start}ms`);
          if (same) return done(null, user.id);
          return invalidCredentials(done, startTime);
        });
      });
  })
);
function invalidCredentials(done, startTime) {
  setTimeout(function () {
    return done(null, false);
  }, startTime - new Date() + 5000);
}
passport.serializeUser((userId, done) => {
  done(null, userId);
});
passport.deserializeUser((userId, done) => {
  done(null, userId);
});

const authenticate = function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (info) return res.status(401).send(info.message);
    if (err) {
      return next(err);
    }
    if (!user) return res.sendStatus(401);
    req.login(user, () => {
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
  isAuthentic,
};
