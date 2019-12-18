const m = require("mithril");
const Loader = require("../components/Loader.js");

require("./Login.scss");

const STATUS = {
  FRESH: "FRESH",
  CHECKING: "CHECKING",
  INVALID: "INVALID",
};

const login = {
  credentials: {},
  status: STATUS.FRESH,

  view: function() {
    return (
      <div class="form-container">
        <form action="#" onsubmit={this.submit}>
          <label>
            <div>E-Mail-Adresse</div>
            <input
              inputmode="email"
              autocapitalize="off"
              onchange={function(e) {
                login.credentials.username = e.currentTarget.value
                  .trim()
                  .toLowerCase();
              }}
              oninput={function(e) {
                login.status = STATUS.FRESH;
              }}
              required
            />
          </label>
          <label>
            <div>Passwort</div>
            <input
              type="password"
              onchange={function(e) {
                login.credentials.password = e.currentTarget.value;
              }}
              oninput={() => {
                login.status = STATUS.FRESH;
              }}
            />
          </label>
          {this.status === STATUS.INVALID && (
            <div aria-live="assertive" class="error">
              Falsches Passwort oder unbekannte E-Mail-Adresse
            </div>
          )}
          <div>
            <button type="submit">Anmelden</button>
            {this.status === STATUS.CHECKING && (
              <span aria-live="polite" class="checking">
                Überprüfe&nbsp;
                <Loader />
              </span>
            )}
          </div>
        </form>
      </div>
    );
  },

  submit: function(e) {
    e.preventDefault();
    document.activeElement.blur();
    login.status = STATUS.CHECKING;
    m.request({
      method: "POST",
      url: "/api/login",
      body: login.credentials,
    })
      .then(function() {
        m.route.set("/");
      })
      .catch(function(error) {
        if (error.code === 401) login.status = STATUS.INVALID;
      });
  },
};

module.exports = login;
