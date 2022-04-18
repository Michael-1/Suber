const { userCollection } = require("./db");

module.exports = async (req, res, next) => {
  req.community = (await userCollection.doc(req.user).get()).get("community");
  next();
};
