const { taskCollection, userCollection, projectCollection } = require("./db");

module.exports = function(req, res) {
  const userDocRef = userCollection.doc(req.user);
  const adminPriviledge = userDocRef.get().then(function(doc) {
    if (doc.get("role") !== "admin") {
      return Promise.reject("Not admin");
    }
  });
  const updatedSettings = Promise.all([
    userCollection.where('status','==','active').get(),
    taskCollection.get(),
  ]).then(function (snapshot) {
    const [users, tasks] = snapshot;
    let weightedUserCount = 0;
    for (const user of users.docs)
      weightedUserCount += user.get("pointMultiplier") || 1;
    let sum = 0;
    for (let task of tasks.docs) {
      sum += task.get("effort") / task.get("frequency");
    }
    return { pointNormaliser: weightedUserCount / sum, weightedUserCount };
  });
  Promise.all([adminPriviledge, updatedSettings])
    .then(function(snapshot) {
      projectCollection
        .doc("parameters")
        .set(snapshot[1])
        .then(function() {
          res.sendStatus(204);
        });
    })
    .catch(function(err) {
      res.status(403);
      res.send(err);
    });
};
