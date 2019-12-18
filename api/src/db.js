const { Firestore } = require("@google-cloud/firestore");

const database = new Firestore({
  projectId:
    process.env.NODE_ENV === "development"
      ? "super-dev-261813"
      : "suber-256519",
});

module.exports = {
  Firestore,
  database,
  taskCollection: database.collection("Task"),
  userCollection: database.collection("User"),
  journalCollection: database.collection("Journal"),
  projectCollection: database.collection("Project"),
};
