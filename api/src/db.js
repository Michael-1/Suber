const { Firestore } = require("@google-cloud/firestore");

const database = new Firestore({
  projectId:
    process.env.NODE_ENV === "development"
      ? "super-dev-261813"
      : "suber-256519",
});

const communityDoc = (communityId) =>
  database.collection("Community").doc(communityId);

module.exports = {
  Firestore,
  database,
  journalCollection: (communityId) =>
    communityDoc(communityId).collection("Journal"),
  communityDoc,
  taskCollection: (communityId) =>
    communityDoc(communityId).collection("Task"),
  userCollection: database.collection("User"),
};
