const m = require("mithril");
const store = require("../store");
const TaskComponent = require("../components/Task");
const Loader = require("../components/Loader");
const Task = require("../../../shared/model/Task");

module.exports = {
  error: false,

  oninit: function() {
    return m
      .request({
        method: "GET",
        url: "/api/tasks",
        type: Task,
      })
      .then(result => {
        store.tasks = result.sort((a, b) => b.urgency - a.urgency);
      })
      .catch(error => {
        if (error.code === 401) {
          m.route.set("/login");
        }
        this.error = true;
      });
  },

  view: function() {
    if (store.tasks.length === 0) {
      if (!this.error)
        return (
          <div>
            Lade 
            <Loader />
          </div>
        );
      return <div class="error">Konnte Aufgaben nicht laden</div>;
    }
    return (
      <table class="task-list">
        {store.tasks.map(task => {
          return m(TaskComponent, task);
        })}
      </table>
    );
  },
};
