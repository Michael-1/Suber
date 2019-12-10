const { userCollection } = require("./db");

module.exports = function(req, res) {
  userCollection
    .get()
    .then(function(snapshot) {
      let you;
      const others = [];
      let totalPoints = 0;
      for (let doc of snapshot.docs) {
        const points = doc.get("points") || 0;
        const user = {
          name: doc.get("name"),
          points,
        };
        if (doc.id === req.user) {
          you = user;
        } else {
          others.push(user);
        }
        totalPoints += points;
      }
      res.json({ you, others, totalPoints });
    })
    .catch(function(err) {
      console.log(err);
    });
};
