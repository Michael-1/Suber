const m = require("mithril");
const TaskList = require("./views/TaskList");
const Login = require("./views/Login");

require("./style.scss");

m.route.prefix = "";
m.route(document.body, "/", {
  "/": TaskList,
  "/login": Login,
});
