const { userCollection } = require("./db");

module.exports = function(req, res) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();
  const aYearAgo = new Date(currentYear - 1, currentMonth, currentDay);

  userCollection
    .doc(req.user)
    .collection("Absence")
    .where("end", ">", aYearAgo)
    .get()
    .then(function(snapshot) {
      const absences = [];
      for (let doc of snapshot.docs) {
        const absence = doc.data();
        absence.key = doc.id;
        absence.start = absence.start.toDate();
        absence.end = absence.end.toDate();
        absences.push(absence);
      }
      res.json(absences);
    });
};
