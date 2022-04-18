const { database, userCollection } = require("../src/db");

const communityId = "yz475coWh2CAaYHwNJKp";
const communityRef = database.collection("Community").doc(communityId);

const migrateCollection = async (oldCollection, newCollection) => {
  const journal = await oldCollection.get();
  for (const doc of journal.docs) {
    newCollection.doc(doc.id).set(doc.data());
  }
};
migrateCollection(
  database.collection("Journal"),
  communityRef.collection("Journal")
);
migrateCollection(database.collection("Task"), communityRef.collection("Task"));

const migrateUsers = async () => {
  const users = await userCollection.get();
  for (const doc of users.docs) {
    doc.ref.update("community", communityId);
  }
};
migrateUsers();
