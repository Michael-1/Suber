const express = require('express');
var cors = require('cors');
const {Datastore} = require('@google-cloud/datastore');

const app = express();

app.use(cors());

const datastore = new Datastore();
const queryTasks = datastore.createQuery(["Task"]);

app.get('/jobs', (req, res) => {
  getTasks((err, entities) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(entities);
  });
});

function getTasks(cb) {
  datastore.runQuery(queryTasks, (err, entities) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, entities);
  });
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} …`);
});

