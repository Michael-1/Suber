const m = require("mithril");
const Balance = require("../components/Balance");
const TaskList = require("../components/TaskList");

const STATUS = {
  LOADING: "LOADING",
};

const Main = {
  view: function() {
    return (
      <div>
        <Balance />
        <TaskList />
      </div>
    );
  },
};

module.exports = Main;
