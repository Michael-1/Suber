const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./auth");
const getTasks = require("./getTasks");
const getBalance = require("./getBalance");
const getSettings = require("./getSettings");
const markAsDone = require("./markAsDone");
const updateProjectSettings = require("./updateProjectSettings");
const getAbsences = require("./getAbsences");
const addAbsence = require("./addAbsence");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("trust proxy", 1);
app.use(auth.session);
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.post("/api/login", auth.authenticate);

app.get("/api/tasks", auth.isAuthentic, getTasks);
app.get("/api/balance", auth.isAuthentic, getBalance);
app.get("/api/settings", auth.isAuthentic, getSettings);
app.post("/api/task/:key/done", auth.isAuthentic, markAsDone);
app.patch("/api/settings", auth.isAuthentic, updateProjectSettings);
app.get("/api/absences", auth.isAuthentic, getAbsences);
app.post("/api/absence", auth.isAuthentic, addAbsence);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} …`);
});
