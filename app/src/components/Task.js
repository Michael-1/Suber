const m = require("mithril");
const store = require("../store");
const { formatPoints } = require("../helpers/Formatting");
const Balance = require("./Balance");
const Loader = require("./Loader");

require("./Task.scss");

const STATUS = {
  STATUS: "INITIAL",
  PROCESSING: "PROCESSING",
  DONE: "DONE",
  FAILED: "FAILED",
};

function Task() {
  return {
    view: function (vnode) {
      const task = vnode.attrs;
      const numberOfUsers = store.users.length;
      const balanceChangeFactor = (numberOfUsers - 1) / numberOfUsers;
      // Initial
      return (
        <tr
          style={
            task.status !== STATUS.DONE && task.urgency > 1
              ? `background-color:rgba(255,97,97,${
                  (task.urgency - 1) / Math.max(store.tasks[0].urgency - 1, 1)
                })`
              : null
          }
          class={task.status === STATUS.DONE ? "done" : null}
        >
          <td>
            <span class="room">{task.room}</span>
            <span class="object">{task.object}</span>
          </td>
          <td class="points">
            {numberOfUsers &&
              store.settings.pointNormaliser &&
              formatPoints(
                task.points *
                  balanceChangeFactor *
                  store.settings.pointNormaliser
              )}
          </td>
          <td>
            <button
              onclick={
                task.status === STATUS.DONE
                  ? this.undo.bind(task)
                  : this.markAsDone.bind(task)
              }
              disabled={task.status === STATUS.PROCESSING}
            >
              {task.status === STATUS.PROCESSING ? (
                <Loader />
              ) : task.status === STATUS.DONE ? (
                "↺"
              ) : (
                "  ✔  "
              )}
            </button>
          </td>
        </tr>
      );
    },

    markAsDone: function () {
      this.status = STATUS.PROCESSING;
      m.request({
        method: "POST",
        url: "/api/task/:key/done",
        params: { key: this.key },
      }).then((res) => {
        this.status = STATUS.DONE;
        Balance.addPoints(res.points);
      });
    },

    undo: function () {
      this.status = STATUS.PROCESSING;
      m.request({
        method: "POST",
        url: "/api/task/:key/undo",
        params: { key: this.key },
      }).then((res) => {
        this.status = STATUS.INITIAL;
        this.lastDone = new Date(res.lastDone);
        Balance.addPoints(-res.points);
      });
    },
  };
}

module.exports = Task;
