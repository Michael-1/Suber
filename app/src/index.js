const m = require("mithril");
const Main = require("./views/Main");
const Login = require("./views/Login");
const Absences = require("./views/Absences");

require("./style.scss");

m.route.prefix = "";
m.route(document.body, "/", {
  "/": Main,
  "/login": Login,
  "/absences": Absences,
});
