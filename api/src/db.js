const { Firestore } = require("@google-cloud/firestore");

const database = new Firestore();

module.exports = {
  Firestore,
  database,
  taskCollection: database.collection("Task"),
  userCollection: database.collection("User"),
  journalCollection: database.collection("Journal"),
  projectCollection: database.collection("Project"),
};
