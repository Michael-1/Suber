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
        store.tasks = result;
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
        <h1>Tasks</h1>
        <table>
          <thead>
            <tr>
              <th>Aufgabe</th>
              <th>Freq.</th>
              <th>Zuletzt</th>
              <th>Dringlichkeit</th>
              <th>Punkte</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {store.tasks.map(task => {
              return m(TaskComponent, task);
            })}
          </tbody>
        </table>
      </div>
    );
  },
};
