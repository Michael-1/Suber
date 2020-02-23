const {
  Firestore,
  database,
  userCollection,
  journalCollection,
  taskCollection,
} = require("./db");

module.exports = function markAsDone(req, res) {
  let points;
  let lastDone;
  database
    .runTransaction(function(transaction) {
      return transaction
        .get(
          journalCollection
            .where("task", "==", req.params.key)
            .where("status", "==", "done")
            .orderBy("time", "desc")
            .limit(1)
        )
        .then(function(journalDoc) {
          const entry = journalDoc.docs[0];
          if (journalDoc.empty || entry.get("user") !== req.user)
            return Promise.reject("You can only undo your own work");
          points = entry.get("points");
          lastDone = entry.get("taskDetails.lastDone");
          transaction.update(entry.ref, "status", "undone");
          transaction.update(
            taskCollection.doc(req.params.key),
            "lastDone",
            lastDone
          );
          transaction.update(
            userCollection.doc(req.user),
            "points",
            Firestore.FieldValue.increment(-points)
          );
        });
    })
    .then(function() {
      res.json({ points, lastDone: lastDone.toDate() });
    })
    .catch(function(err) {
      res.status(403).send(err);
    });
};
