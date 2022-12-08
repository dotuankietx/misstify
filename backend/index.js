const app = require("./src/server");
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const config = require("./src/config");

const server = require("http").createServer(app);

function init() {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: config.DBURL,
    });
    console.log("database is connected!");
  } catch (err) {
    console.log("connect to server failed!");
  }
  try {
    server.listen(config.PORT, config.HOST, () => {
      console.log(`server is running on ${config.HOST}:${config.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
init();
