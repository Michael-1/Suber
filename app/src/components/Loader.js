const m = require("mithril");
require("./Loader.scss");

module.exports = {
  view: function() {
    return (
      <span class="loader" aria-hidden="true">
        <span>•</span>
        <span>•</span>
        <span>•</span>
      </span>
    );
  },
};
