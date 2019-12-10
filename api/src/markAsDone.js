const {
  Firestore,
  database,
  taskCollection,
  userCollection,
  journalCollection,
  projectCollection,
} = require("./db");
const Task = require("../../shared/model/Task");

const projectDocRef = projectCollection.doc("parameters");

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
  const pointNormaliser = database.get(projectDocRef);
  Promise.all([task, pointNormaliser])
    .then(function(snapshot) {
      const taskData = snapshot[0];
      taskData.lastDone = taskData.lastDone.toDate();
      const task = new Task(taskData, currentTime);
      const points = task.points * snapshot[1].pointNormaliser;
      res.json({ points });
      userDocRef.update("points", Firestore.FieldValue.increment(points));
      journalCollection.add({
        time: currentTime,
        user: req.user,
        task: req.params.key,
        points,
      });
    })
    .catch(function(err) {
      console.error(err);
      res.sendStatus(500);
    });
};
