require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./auth");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("trust proxy", 1);
app.use(auth.session);
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.post("/api/login", auth.authenticate);

app.get("/api/tasks", auth.isAuthentic, require("./getTasks"));
app.get("/api/balance", auth.isAuthentic, require("./getBalance"));
app.get("/api/settings", auth.isAuthentic, require("./getSettings"));
app.post("/api/task/:key/done", auth.isAuthentic, require("./markAsDone"));
app.post("/api/task/:key/undo", auth.isAuthentic, require("./undo"));
app.get("/api/absences", auth.isAuthentic, require("./getAbsences"));
app.post("/api/absence", auth.isAuthentic, require("./addAbsence"));
app.patch(
  "/api/settings",
  auth.isAuthentic,
  require("./updateCommunitySettings")
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} …`);
});
