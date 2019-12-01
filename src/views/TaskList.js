const m = require("mithril");
const param = require("../param");
const TaskComponent = require("../components/Task");
const { Task } = require("../model/Task");

const TaskList = {
  list: [],

  oninit: function() {
    return m
      .request({
        method: "GET",
        url: param.API_BASE_URL + "tasks",
        type: Task
      })
      .then(function(result) {
        TaskList.list = result;
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
            {TaskList.list.map(task => {
              return m(TaskComponent, task);
            })}
          </tbody>
        </table>
      </div>
    );
  }
};

export default TaskList;
