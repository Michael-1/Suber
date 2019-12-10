const m = require("mithril");
const TaskComponent = require("../components/Task");
const Task = require("../../../shared/model/Task");

const TaskList = {
  list: [],

  oninit: function() {
    return m
      .request({
        method: "GET",
        url: "/api/tasks",
        type: Task,
      })
      .then(function(result) {
        TaskList.list = result;
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
            {this.list.map(task => {
              return m(TaskComponent, task);
            })}
          </tbody>
        </table>
      </div>
    );
  },
};

module.exports = TaskList;
