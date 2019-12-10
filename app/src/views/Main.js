const m = require("mithril");
const store = require("../store");
const Balance = require("../components/Balance");
const TaskList = require("../components/TaskList");

const STATUS = {
  LOADING: "LOADING",
};

module.exports = {
  oninit: function() {
    return m
      .request({
        method: "GET",
        url: "/api/settings",
      })
      .then(function(result) {
        store.settings = result;
      })
      .catch(function(error) {
        if (error.code === 401) {
          m.route.set("/login");
        }
      });
  },

  view: function() {
    return (
      <div>
        <Balance />
        <TaskList />
      </div>
    );
  },
};
