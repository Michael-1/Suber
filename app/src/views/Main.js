const m = require("mithril");
const store = require("../store");
const Balance = require("../components/Balance");
const TaskList = require("../components/TaskList");

module.exports = {
  oninit: async () => {
    try {
      store.settings = await m.request({
        url: "/api/settings",
      });
    } catch (error) {
      if (error.code === 401) {
        m.route.set("/login");
      }
    }
  },

  view: function () {
    return (
      <div>
        <nav class="right">
          <div class="icon">
            {m(
              "a[href='/absences']",
              { config: m.route },
              <img
                src={require("../assets/away.svg")}
                title="Längere Abwesenheiten"
              />
            )}
          </div>
        </nav>
        <main>
          <Balance />
          <TaskList />
        </main>
      </div>
    );
  },
};
