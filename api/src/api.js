const express = require("express");
const cors = require("cors");
const getTasks = require("./getTasks");
const markAsDone = require("./markAsDone");

const app = express();
app.use(cors());

app.get("/tasks", getTasks);
app.patch("/task/:key/done", markAsDone);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} …`);
});
