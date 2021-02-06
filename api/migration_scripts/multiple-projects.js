const { database, userCollection } = require("../src/db");

const projectId = "yz475coWh2CAaYHwNJKp";
const projectRef = database.collection("Project").doc(projectId);

const migrateCollection = async (oldCollection, newCollection) => {
  const journal = await oldCollection.get();
  for (const doc of journal.docs) {
    newCollection.doc(doc.id).set(doc.data());
  }
};
migrateCollection(
  database.collection("Journal"),
  projectRef.collection("Journal")
);
migrateCollection(database.collection("Task"), projectRef.collection("Task"));

const migrateUsers = async () => {
  const users = await userCollection.get();
  for (const doc of users.docs) {
    doc.ref.update("projects", [projectId]);
  }
};
migrateUsers();
