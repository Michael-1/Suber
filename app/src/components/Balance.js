const m = require("mithril");
const store = require("../store");
const formatNumber = require("../helpers/formatNumber");

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
      <div>
        <div>Du: {formatNumber(store.users.you.points - meanPoints, 2)}</div>
        {store.users.others.map(user => {
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
