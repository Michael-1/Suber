const m = require("mithril");
const store = require("../store");
const { formatPoints } = require("../helpers/Formatting");
require("./Balance.scss");

module.exports = {
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
        const { maxAbsPoints } = getBalanceStatistics(store.users);
        store.initialMaxAbsPoints = maxAbsPoints;
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
    let { meanPoints, maxAbsPoints } = getBalanceStatistics(store.users);
    if (maxAbsPoints > store.initialMaxAbsPoints) {
      store.initialMaxAbsPoints = maxAbsPoints;
    } else {
      maxAbsPoints = store.initialMaxAbsPoints;
    }
    return (
      <table class="balance">
        {store.users.map(user => {
          const points = user.points - meanPoints;
          const barWidth = (points / maxAbsPoints) * 100;
          return (
            <tr key={user.key}>
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

function formatBalanceNumber(number) {
  if (number < 0.5 && number > -0.5) return "0";
  if (number >= 0) return "+" + formatPoints(number);
  return "" + formatPoints(-number) + "−";
}

function getBalanceStatistics(users) {
  let totalPoints = 0;
  for (const user of store.users) {
    totalPoints += user.points;
  }
  const meanPoints = totalPoints / store.users.length;
  let maxAbsPoints = 0;
  for (const user of users) {
    const absPoints = Math.abs(user.points - meanPoints);
    if (absPoints > maxAbsPoints) maxAbsPoints = absPoints;
  }
  return { meanPoints, maxAbsPoints };
}
