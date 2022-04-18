const { communityDoc } = require("./db");

module.exports = function (req, res) {
  communityDoc(req.community)
    .get()
    .then(function (doc) {
      res.json(doc.data());
    });
};
