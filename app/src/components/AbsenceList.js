const m = require("mithril");
const store = require("../store");
const AbsenceComponent = require("../components/Absence");
const Loader = require("../components/Loader");

module.exports = {
  error: false,
  loading: true,

  oninit: function() {
    return m
      .request({
        method: "GET",
        url: "/api/absences",
      })
      .then(result => {
        store.absences = result;
        this.loading = false;
      })
      .catch(error => {
        if (error.code === 401) {
          m.route.set("/login");
        }
        this.error = true;
      });
  },

  view: function() {
    if (this.error) {
      return (
        <div class="error">Konnte gespeicherte Abwesenheiten nicht laden</div>
      );
    }
    if (this.loading) {
      return (
        <div>
          Lade 
          <Loader />
        </div>
      );
    }
    return (
      <table class="absence-list">
        {store.absences
          .sort((a, b) => b.start - a.start)
          .map(absence => {
            return m(AbsenceComponent, absence);
          })}
      </table>
    );
  },
};
