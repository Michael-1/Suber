const { taskCollection, userCollection, communityDoc } = require("./db");

module.exports = async function (req, res) {
  const userDocRef = userCollection.doc(req.user);
  const userDoc = await userDocRef.get();
  if (userDoc.get("role") !== "admin") {
    return Promise.reject("Not admin");
  }

  const [users, tasks] = await Promise.all([
    userCollection.where("status", "==", "active").get(),
    taskCollection(req.community).get(),
  ]);
  let weightedUserCount = 0;
  for (const user of users.docs)
    weightedUserCount += user.get("pointMultiplier") || 1;
  let sum = 0;
  for (let task of tasks.docs) {
    sum += task.get("effort") / task.get("frequency");
  }

  communityDoc(req.community)
    .set({ pointNormaliser: weightedUserCount / sum, weightedUserCount })
    .then(function () {
      res.sendStatus(204);
    })
    .catch(function (err) {
      res.status(403);
      res.send(err);
    });
};
