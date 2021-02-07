const { communityDoc } = require("./db");

module.exports = function(req, res) {
  communityDoc
    .get()
    .then(function(doc) {
      res.json(doc.data());
    });
};
