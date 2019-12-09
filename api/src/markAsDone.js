const { database, taskCollection } = require("./db");
const { Task } = require("../../shared/model/Task");

module.exports = function markAsDone(req, res) {
  const currentTime = new Date();

  database.runTransaction(function(transaction) {
    return transaction
      .get(taskCollection.doc(req.params.key))
      .then(function(doc) {
        //const task = new Task(doc.data, currentTime);
        transaction.update(doc.ref, { lastDone: currentTime });
      })
      .then(function() {
        res.sendStatus(204);
      })
      .catch(function(err) {
        res.sendStatus(500);
      });
  });
};
