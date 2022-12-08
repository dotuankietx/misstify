const admin = require("firebase-admin");

module.exports = () => {
  return admin.firestore().collection("name").doc().id;
};
