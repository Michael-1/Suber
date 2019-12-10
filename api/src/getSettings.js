const { projectCollection } = require("./db");

module.exports = function(req, res) {
  projectCollection
    .doc("parameters")
    .get()
    .then(function(doc) {
      res.json(doc.data());
    });
};
