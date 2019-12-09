const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./auth");
const getTasks = require("./getTasks");
const markAsDone = require("./markAsDone");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(auth.session);
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.post("/api/login", auth.authenticate);

app.get("/api/tasks", auth.isAuthentic, getTasks);
app.patch("/api/task/:key/done", auth.isAuthentic, markAsDone);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} …`);
});
