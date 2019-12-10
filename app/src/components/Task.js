const m = require("mithril");
const store = require("../store");
const Balance = require("./Balance");

const STATUS = {
  DONE: "DONE",
};

function Task(initialVnode) {
  users = initialVnode;
  return {
    view: function(vnode) {
      const task = vnode.attrs;
      const numberOfothers = store.users.others
        ? store.users.others.length
        : null;
      const actualPointsMultiplier = numberOfothers / (numberOfothers + 1);
      if (task.status !== STATUS.DONE)
        return (
          <tr>
            <td>
              {task.room}: {task.object}
            </td>
            <td>{task.frequency}</td>
            <td>
              {("00" + task.lastDone.getDate()).slice(-2)}.
              {("00" + (task.lastDone.getMonth() + 1)).slice(-2)}.
            </td>
            <td>{task.urgency.toFixed(1)}</td>
            <td>
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
        this.pointsCredited = res.points;
        Balance.addPoints(res.points);
      });
    },
  };
}

module.exports = Task;
