const {
  Firestore,
  database,
  taskCollection,
  userCollection,
  journalCollection,
  communityDoc,
} = require("./db");
const Task = require("./model/Task");

module.exports = function markAsDone(req, res) {
  const currentTime = new Date();
  const taskDocRef = taskCollection.doc(req.params.key);
  const userDocRef = userCollection.doc(req.user);
  const task = database.runTransaction(function(transaction) {
    return transaction.get(taskDocRef).then(function(taskDoc) {
      transaction.update(taskDoc.ref, { lastDone: currentTime });
      return taskDoc.data();
    });
  });
  const community = communityDoc.get();
  const user = userDocRef.get();
  Promise.all([task, community, user])
    .then(function (snapshot) {
      const [taskData, community, user] = snapshot;
      taskData.lastDone = taskData.lastDone.toDate();
      const task = new Task(taskData, currentTime);
      const points =
        task.points *
        (user.get("pointMultiplier") || 1) *
        community.get("pointNormaliser");
      res.json({ points });
      if (points == 0) return;
      userDocRef.update("points", Firestore.FieldValue.increment(points));
      journalCollection.add({
        time: currentTime,
        user: req.user,
        task: req.params.key,
        taskDetails: taskData,
        points,
        status: "done",
      });
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
};
