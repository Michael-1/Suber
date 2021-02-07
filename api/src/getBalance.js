const { userCollection } = require("./db");

module.exports = async function (req, res) {
  userCollection
    .where("communities", "array-contains", req.community)
    .where("status", "==", "active")
    .get()
    .then(function (snapshot) {
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
    .catch(function (err) {
      console.log(err);
    });
};
