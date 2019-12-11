const m = require("mithril");
const store = require("../store");
const Balance = require("./Balance");
const Loader = require("./Loader");

require("./Task.scss");

const STATUS = {
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  FAILED: "FAILED",
};

function Task(initialVnode) {
  users = initialVnode;
  return {
    view: function(vnode) {
      const task = vnode.attrs;
      const numberOfUsers = store.users.length;
      const actualPointsMultiplier = (numberOfUsers - 1) / numberOfUsers;
      // Initial
      return (
        <tr
          style={
            task.status !== STATUS.DONE &&
            task.urgency > 1 &&
            `background-color:rgb(255,97,97,${(task.urgency - 1) /
              (store.tasks[0].urgency - 1)})`
          }
          class={task.status === STATUS.DONE && "done"}
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
            <button
              onclick={this.markAsDone.bind(task)}
              disabled={
                task.status === STATUS.PROCESSING || task.status === STATUS.DONE
              }
            >
              {task.status === STATUS.PROCESSING ? <Loader /> : "  ✔  "}
            </button>
          </td>
        </tr>
      );
    },

    markAsDone: function() {
      this.status = STATUS.PROCESSING;
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
