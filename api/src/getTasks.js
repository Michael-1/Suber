const { Datastore } = require("@google-cloud/datastore");

const datastore = new Datastore();
const queryTasks = datastore.createQuery(["Task"]);

module.exports = function(req, res) {
  datastore.runQuery(queryTasks, (err, entities) => {
    if (err) {
      console.log(err);
      return;
    }
    for (let entity of entities) {
      entity.key = entity[datastore.KEY].name;
    }
    res.json(entities);
  });
};
