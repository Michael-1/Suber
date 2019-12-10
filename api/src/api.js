const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./auth");
const getTasks = require("./getTasks");
const getBalance = require("./getBalance");
const getSettings = require("./getSettings");
const markAsDone = require("./markAsDone");
const updateProjectSettings = require("./updateProjectSettings");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth.session);
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.post("/api/login", auth.authenticate);

app.get("/api/tasks", auth.isAuthentic, getTasks);
app.get("/api/balance", auth.isAuthentic, getBalance);
app.get("/api/settings", auth.isAuthentic, getSettings);
app.post("/api/task/:key/done", auth.isAuthentic, markAsDone);
app.patch("/api/settings", auth.isAuthentic, updateProjectSettings);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} …`);
});
