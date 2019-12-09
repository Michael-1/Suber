const { Firestore } = require("@google-cloud/firestore");

const database = new Firestore();

module.exports = {
  database,
  taskCollection: database.collection("Task")
};
