const {
  Firestore,
  database,
  userCollection,
  journalCollection,
} = require("./db");

module.exports = function(req, res) {
  const start = new Date(Number(req.query.start));
  const end = new Date(Number(req.query.end));
  const points = (end - start) / (1000 * 60 * 60 * 24) - 10;
  if (points <= 0 || !points) {
    res.status(400).send("Only absences of more than 10 days give points");
    return;
  }
  if (new Date() - new Date(start) > 1000 * 60 * 60 * 24 * 365) {
    res.status(400).send("No my friend, that’s too long ago");
    return;
  }

  const absenceCollection = userCollection.doc(req.user).collection("Absence");

  database
    .runTransaction(function(transaction) {
      return transaction
        .get(absenceCollection.where("end", ">", start))
        .then(function(snapshot) {
          // Check for overlaps
          for (let doc of snapshot.docs) {
            if (doc.get("start") <= end) {
              const start = new Date(doc.get("start"));
              const end = new Date(doc.get("end"));
              throw new OverlapException(
                `New absence would overlap with existing: ${start.toLocaleDateString()}–${end.toLocaleDateString()}`
              );
            }
          }
          // Add absence
          transaction.create(absenceCollection.doc(), {
            start,
            end,
            user: req.user,
            points,
          });
          // Add points
          transaction.update(
            userCollection.doc(req.user),
            "points",
            Firestore.FieldValue.increment(points)
          );
          transaction.create(journalCollection.doc(), {
            time: new Date(),
            user: req.user,
            type: "absence",
            points,
          });
        });
    })
    .then(function() {
      res.sendStatus(201);
    })
    .catch(function(err) {
      if (err.name === "OverlapException") {
        res.status(409).send(err.message);
        return;
      }
      res.status(500).send(err.message);
    });
};

function OverlapException(message) {
  this.message = message;
  this.name = "OverlapException";
}
