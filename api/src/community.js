const { userCollection } = require("./db");

module.exports = async (req, res, next) => {
  try {
    req.community = (await userCollection.doc(req.user).get()).get("community");
  } catch (e) {
    console.error(e);
    console.debug("User:", req.user);
  }
  next();
};
