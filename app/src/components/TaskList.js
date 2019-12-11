const m = require("mithril");
const store = require("../store");
const TaskComponent = require("../components/Task");
const Task = require("../../../shared/model/Task");

module.exports = {
  oninit: function() {
    return m
      .request({
        method: "GET",
        url: "/api/tasks",
        type: Task,
      })
      .then(function(result) {
        store.tasks = result.sort((a, b) => b.urgency - a.urgency);
      })
      .catch(function(error) {
        if (error.code === 401) {
          m.route.set("/login");
        }
      });
  },

  view: function() {
    return (
      <table class="task-list">
        {store.tasks.map(task => {
          return m(TaskComponent, task);
        })}
      </table>
    );
  },
};
