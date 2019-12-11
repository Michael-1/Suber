const { userCollection } = require("./db");

module.exports = function(req, res) {
  userCollection
    .get()
    .then(function(snapshot) {
      const users = [];
      for (let doc of snapshot.docs) {
        users.push({
          name: doc.get("name"),
          points: doc.get("points") || 0,
          key: doc.id,
          currentUser: doc.id === req.user,
        });
      }
      res.json(users);
    })
    .catch(function(err) {
      console.log(err);
    });
};
