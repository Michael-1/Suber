const m = require("mithril");
const store = require("../store");
require("./Balance.scss");

module.exports = {
  users: {},

  oninit: function() {
    return m
      .request({
        method: "GET",
        url: "/api/balance",
      })
      .then(function(result) {
        store.users = result.sort((a, b) => {
          if (a.currentUser) return -1;
          if (b.currentUser) return 1;
          return b.points - a.points;
        });
      })
      .catch(function(error) {
        if (error.code === 401) {
          m.route.set("/login");
        }
      });
  },

  addPoints: function(points) {
    store.users.find(u => u.currentUser).points += points;
  },

  view: function() {
    if (!store.users.length) {
      return;
    }
    let totalPoints = 0;
    for (user of store.users) {
      totalPoints += user.points;
      const absPoints = Math.abs(user.points);
      if (absPoints > maxAbsPoints) maxAbsPoints = absPoints;
    }
    const meanPoints = totalPoints / store.users.length;
    let maxAbsPoints = 0;
    for (user of store.users) {
      const absPoints = Math.abs(user.points - meanPoints);
      if (absPoints > maxAbsPoints) maxAbsPoints = absPoints;
    }
    return (
      <table class="balance">
        {store.users.map(user => {
          const points = user.points - meanPoints;
          const barWidth = (points / maxAbsPoints) * 100;
          return (
            <tr>
              <td>
                {points >= 0 && <span>{user.name}</span>}
                <div
                  class="bar"
                  style={`width:${barWidth < 0 ? -barWidth : 0}%`}
                >
                  <span>{points < 0 && formatBalanceNumber(points, 2)}</span>
                </div>
              </td>
              <td>
                <div
                  class="bar"
                  style={`width:${barWidth > 0 ? barWidth : 0}%`}
                >
                  <span>{points >= 0 && formatBalanceNumber(points, 2)} </span>
                </div>
                {points < 0 && <span>{user.name}</span>}
              </td>
            </tr>
          );
        })}
      </table>
    );
  },
};

function formatBalanceNumber(number, precision) {
  if (number < 0.5 && number > -0.5) return number.toFixed(0);
  if (number >= 0) return "+" + number.toFixed(0);
  return "" + (-number).toFixed(0) + "−";
}
