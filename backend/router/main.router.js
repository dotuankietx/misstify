const app = require("express");
const admin = require("firebase-admin");

const router = app.Router();

const firebaseId = require("../utilities/createFirebaseId");

router.get("/", async (req, res) => {
  let result = await admin.firestore().collection("Musics").get();
  let data = [];
  result.forEach((doc) => {
    data.push(doc.data());
  });
  //console.log(data);
  return res.send(data);
});

router.post("/addMusic", async (req, res) => {
  let { artist, title, duration, artwork, url } = req.body;
  console.log(req.body)
  let id = firebaseId();
  try {
    let result = await admin.firestore().collection("Musics").doc(id).create({
      id: id,
      artist: artist,
      artwork: artwork,
      duration: duration,
      url: url,
      title: title,
    });
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
});

router.post("/editSong", async (req, res) => {
  let { id } = req.body;
  console.log(req.body);
  try {
    let result = await admin
      .firestore()
      .collection("Musics")
      .doc(id)
      .update(req.body);
    return res.send(result);
  } catch (error) {
    return res.send(error);
  }
});

router.get("/filterSong", async (req, res) => {
  let { title } = req.body;
  let result = await admin
    .firestore()
    .collection("Musics")
    .orderBy("title")
    .startAt(title)
    .endAt(`${title}\uf8ff`)
    .get();
  let data = [];
  result.forEach((doc) => {
    data.push(doc.data());
  });
  return res.send(data);
});

router.delete("/deleteSong", async (req, res) => {
  let { id } = req.body;
  let result = await admin.firestore().collection("Musics").doc(id).delete();
  res.send("Song deleted");
});

module.exports = router;
