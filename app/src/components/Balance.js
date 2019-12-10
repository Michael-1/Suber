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
        store.users = result;
      })
      .catch(function(error) {
        if (error.code === 401) {
          m.route.set("/login");
        }
      });
  },

  addPoints: function(points) {
    store.users.you.points += points;
    store.users.totalPoints += points;
  },

  view: function() {
    if (!store.users.you) {
      return;
    }
    const meanPoints =
      store.users.totalPoints / (store.users.others.length + 1);
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
