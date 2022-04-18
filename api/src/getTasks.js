const { taskCollection } = require("./db");

module.exports = function(req, res) {
  taskCollection
    .get()
    .then(function (snapshot) {
      const tasks = [];
      for (let doc of snapshot.docs) {
        const task = doc.data();
        task.lastDone = task.lastDone.toDate();
        task.key = doc.id;
        tasks.push(task);
      }
      res.json(tasks);
    })
    .catch(function (err) {
      console.log(err);
    });
};
