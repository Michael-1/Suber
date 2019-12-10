const m = require("mithril");
const Main = require("./views/Main");
const Login = require("./views/Login");

require("./style.scss");

m.route.prefix = "";
m.route(document.body, "/", {
  "/": Main,
  "/login": Login,
});
