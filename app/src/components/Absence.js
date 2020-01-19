const m = require("mithril");
const { formatDate, formatPoints } = require("../helpers/Formatting");

require("./Absence.scss");

module.exports = {
  view: function(vnode) {
    const absence = vnode.attrs;
    // Initial
    return (
      <tr class={absence.new && "new"}>
        <td>
          {`${formatDate(new Date(absence.start))}–${formatDate(
            new Date(absence.end)
          )}`}
        </td>
        <td class="points">{formatPoints(absence.points)}</td>
      </tr>
    );
  },
};
