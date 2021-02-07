const { userCollection } = require("./db");

module.exports = function (req, res) {
  userCollection
    .doc(req.user)
    .get()
    .then(function (doc) {
      res.json({
        id: req.userdoc.data(),
        communities: doc.get("communities"),
      });
    });
};
