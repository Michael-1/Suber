const m = require("mithril");
const param = require("../param");

module.exports = {
  view: function(vnode) {
    const task = vnode.attrs;
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
  },

  markAsDone: function() {
    m.request({
      method: "PATCH",
      url: param.API_BASE_URL + "task/:key/done",
      params: { key: this.key }
    }).then(console.log(this.key));
  }
};
