const m = require("mithril");
const formatNumber = require("../helpers/formatNumber");

const Balance = {
  state: {},

  oninit: function() {
    return m
      .request({
        method: "GET",
        url: "/api/balance",
      })
      .then(function(result) {
        Balance.state = result;
      })
      .catch(function(error) {
        if (error.code === 401) {
          m.route.set("/login");
        }
      });
  },

  addPoints: function(points) {
    Balance.state.you.points += points;
    Balance.state.totalPoints += points;
  },

  view: function() {
    if (!Balance.state.you) {
      return;
    }
    const meanPoints =
      Balance.state.totalPoints / (Balance.state.otherUsers.length + 1);
    return (
      <div>
        <div>Du: {formatNumber(Balance.state.you.points - meanPoints, 2)}</div>
        {Balance.state.otherUsers.map(user => {
          return (
            <div>
              {user.name}: {formatNumber(user.points - meanPoints, 2)}
            </div>
          );
        })}
      </div>
    );
  },
};

module.exports = Balance;
