const m = require("mithril");
const Loader = require("../components/Loader.js");
const store = require("../store");
const { formatDate } = require("../helpers/Formatting");

require("./Absence.scss");

const STATUS = {
  FRESH: "FRESH",
  PROCESSING: "PROCESSING",
  SUCCESS: "SUCCESS",
  INVALID: "INVALID",
};

const newAbsence = {
  status: STATUS.FRESH,
  errorReason: null,

  view: function() {
    return (
      <div class="add-absence">
        <form action="#" onsubmit={this.submit}>
          <div class="datepicker">
            <input
              type="date"
              placeholder="Von"
              oninput={function(e) {
                newAbsence.start = new Date(
                  e.currentTarget.value + "T00:00:00.000Z"
                );
                newAbsence.status = STATUS.FRESH;
                newAbsence.calculatePoints();
              }}
              disabled={this.status === STATUS.PROCESSING}
            />
            –
            <input
              type="date"
              placeholder="Bis"
              oninput={function(e) {
                newAbsence.end = new Date(
                  e.currentTarget.value + "T00:00:00.000Z"
                );
                newAbsence.status = STATUS.FRESH;
                newAbsence.calculatePoints();
              }}
              required
              disabled={this.status === STATUS.PROCESSING}
            />
          </div>
          {this.status === STATUS.INVALID && (
            <div aria-live="assertive" class="error">
              {this.errorReason}
            </div>
          )}
          <div>
            <div class="stretch">
              {this.days
                ? `${this.days} ${this.days > 1 ? "Tage" : "Tag"}`
                : ""}
              {(this.status === STATUS.FRESH ||
                this.status === STATUS.PROCESSING) &&
                this.points &&
                `, ${this.points} ${this.points >= 1.5 ? "Punkte" : "Punkt"}`}
            </div>
            <button
              onclick={this.add}
              disabled={
                this.status === STATUS.PROCESSING ||
                this.status === STATUS.SUCCESS
              }
            >
              {this.status === STATUS.PROCESSING ? <Loader /> : "Hinzufügen"}
            </button>
          </div>
          {this.status === STATUS.SUCCESS && (
            <div aria-live="assertive" class="success">
              Absenz vermerkt und {this.points} Punkt
              {this.points >= 1.5 && "e"} gutgeschrieben
            </div>
          )}
        </form>
      </div>
    );
  },

  calculatePoints() {
    let days = (newAbsence.end - newAbsence.start) / (1000 * 60 * 60 * 24) + 1;
    if (!days || days <= 0) days = undefined;
    newAbsence.days = days;
    let points = days - 10;
    if (!points || points <= 0) points = undefined;
    newAbsence.points = points;
  },

  validateInput: function() {
    newAbsence.calculatePoints();
    if (
      !newAbsence.start ||
      !newAbsence.end ||
      isNaN(newAbsence.start) ||
      isNaN(newAbsence.end)
    ) {
      if (newAbsence.status === STATUS.PROCESSING) {
        newAbsence.status = STATUS.INVALID;
        newAbsence.errorReason = "Beide Datumsfelder ausfüllen";
      } else {
        newAbsence.status = STATUS.FRESH;
      }
      return false;
    }
    if (newAbsence.end <= newAbsence.start) {
      newAbsence.status = STATUS.INVALID;
      newAbsence.errorReason = "Das End-Datum muss nach dem Start-Datum liegen";
      return false;
    }
    if (newAbsence.points <= 0 || !newAbsence.points) {
      if (newAbsence.status === STATUS.PROCESSING) {
        newAbsence.status = STATUS.INVALID;
        newAbsence.errorReason =
          "Abwesenheit muss länger als 10 Tage am Stück sein für eine Punktgutschrift";
      } else {
        newAbsence.status = STATUS.FRESH;
      }
      return false;
    }
    for (existingAbsence of store.absences) {
      if (
        existingAbsence.end > newAbsence.start &&
        existingAbsence.start < newAbsence.end
      ) {
        newAbsence.status = STATUS.INVALID;
        newAbsence.errorReason = `Es gibt bereits eine überlappende Abwesenheit: ${formatDate(
          new Date(existingAbsence.start)
        )}–${formatDate(new Date(existingAbsence.end))}`;
        return false;
      }
    }
    return true;
  },

  add: function(e) {
    e.preventDefault();
    newAbsence.status = STATUS.PROCESSING;
    if (!newAbsence.validateInput()) return;
    document.activeElement.blur();
    m.request({
      method: "POST",
      url: "/api/absence",
      params: {
        start: newAbsence.start.getTime(),
        end: newAbsence.end.getTime(),
      },
      responseType: String,
    })
      .then(function() {
        store.absences.push({
          ...newAbsence,
          new: true,
          key: newAbsence.start,
        });
        /*const numberOfUsers = store.users.length;
        Balance.addPoints(
          (newAbsence.points * numberOfUsers) / (numberOfUsers - 1)
        );*/
        newAbsence.status = STATUS.SUCCESS;
      })
      .catch(function(error) {
        newAbsence.status = STATUS.INVALID;
        newAbsence.errorReason = `Server: «${error.response}»`;
      });
  },
};

module.exports = newAbsence;
