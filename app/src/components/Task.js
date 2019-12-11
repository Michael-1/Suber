const m = require("mithril");
const store = require("../store");
const Balance = require("./Balance");

require("./Task.scss");

const STATUS = {
  DONE: "DONE",
};

function Task(initialVnode) {
  users = initialVnode;
  return {
    view: function(vnode) {
      const task = vnode.attrs;
      const numberOfUsers = store.users.length;
      const actualPointsMultiplier = (numberOfUsers - 1) / numberOfUsers;
      if (task.status !== STATUS.DONE)
        return (
          <tr
            style={
              task.urgency > 1 &&
              `background-color:rgb(255,97,97,${(task.urgency - 1) /
                (store.tasks[0].urgency - 1)})`
            }
          >
            <td>
              <span class="room">{task.room}</span>
              <span class="object">{task.object}</span>
            </td>
            <td class="points">
              {actualPointsMultiplier &&
                (
                  task.points *
                  actualPointsMultiplier *
                  store.settings.pointNormaliser
                ).toFixed(2)}
            </td>
            <td>
              <button onclick={this.markAsDone.bind(task)}>Erledigt</button>
            </td>
          </tr>
        );
      // When done
      return (
        <tr>
          <td>
            {task.room}: {task.object}
          </td>
          <td colspan="5">
            {actualPointsMultiplier &&
              (task.pointsCredited * actualPointsMultiplier).toFixed(2)}{" "}
            Punkte gutgeschrieben
          </td>
        </tr>
      );
    },

    markAsDone: function() {
      m.request({
        method: "POST",
        url: "/api/task/:key/done",
        params: { key: this.key },
      }).then(res => {
        this.status = STATUS.DONE;
        this.points = res.points;
        Balance.addPoints(res.points);
      });
    },
  };
}

module.exports = Task;
