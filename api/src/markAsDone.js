const {
  Firestore,
  database,
  taskCollection,
  userCollection,
  journalCollection
} = require("./db");
const Task = require("../../shared/model/Task");

module.exports = function markAsDone(req, res) {
  const currentTime = new Date();
  const taskDocRef = taskCollection.doc(req.params.key);
  const userDocRef = userCollection.doc(req.user);
  database
    .runTransaction(function(transaction) {
      return transaction.get(taskDocRef).then(function(taskDoc) {
        transaction.update(taskDoc.ref, { lastDone: currentTime });
        return taskDoc.data();
      });
    })
    .then(function(taskData) {
      taskData.lastDone = taskData.lastDone.toDate();
      const task = new Task(taskData, currentTime);
      res.json({ points: task.points });
      userDocRef.update("points", Firestore.FieldValue.increment(task.points));
      journalCollection.add({
        time: currentTime,
        user: req.user,
        task: req.params.key,
        points: task.points
      });
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
};
