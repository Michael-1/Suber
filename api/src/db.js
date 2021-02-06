const { Firestore } = require("@google-cloud/firestore");

const database = new Firestore({
  projectId:
    process.env.NODE_ENV === "development"
      ? "super-dev-261813"
      : "suber-256519",
});

const projectCollection = (projectId) =>
  database.collection("Project").doc(projectId);

module.exports = {
  Firestore,
  database,
  journalCollection: (projectId) =>
    projectCollection(projectId).collection("Journal"),
  projectCollection,
  taskCollection: (projectId) =>
    projectCollection(projectId).collection("Task"),
  userCollection: database.collection("User"),
};
