const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();
server.use(cors());
server.use(bodyParser.json());

const main = require("../router/main.router");
server.use("/api/musics", main);

module.exports = server;
