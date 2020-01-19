const m = require("mithril");
const store = require("../store");
const AddAbsence = require("../components/AddAbsence");
const AbsenceList = require("../components/AbsenceList");

module.exports = {
  view: function() {
    return (
      <div>
        {" "}
        <nav class="right">
          <div class="icon">
            {m(
              "a[href='/']",
              { config: m.route },
              <img
                src={require("../assets/close.svg")}
                title="Längere Abwesenheiten"
              />
            )}
          </div>
        </nav>
        <main>
          <h1>Gutschriften für Abwesenheiten</h1>
          <AddAbsence />
          <AbsenceList />
        </main>
      </div>
    );
  },
};
