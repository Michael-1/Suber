const m = require("mithril");

const STATUS = {
  DONE: "DONE",
};

function Task(initialVnode) {
  state = initialVnode;
  return {
    view: function(vnode) {
      const task = vnode.attrs;
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
            <td>{task.points.toFixed(2)}</td>
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
          <td colspan="5">{task.points.toFixed(2)} Punkte gutgeschrieben</td>
        </tr>
      );
    },

    markAsDone: function() {
      m.request({
        method: "PATCH",
        url: "/api/task/:key/done",
        params: { key: this.key },
      }).then(res => {
        this.status = STATUS.DONE;
        this.points = res.points;
      });
    },
  };
}

module.exports = Task;
