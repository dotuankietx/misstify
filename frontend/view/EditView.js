import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import * as DocumentPicker from "expo-document-picker";
import mainApi from "../api/mainApi.js";
import { Audio } from "expo-av";
//Step 1
import { firebase } from "../firebase";
import {
  getStorage,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { fetchCollection, updateSongState } from "../actions/songActions";
import { useEffect } from "react";
import { convertTime } from "../misc/audioController.js";

const EditView = ({ params }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const db = useSelector((state) => state.audio);
  const [Artist, setArtist] = useState(db.selectedSong.Artist);
  const [URL, setUrl] = useState(db.selectedSong.url);
  const [Title, setTitle] = useState(db.selectedSong.title);
  const [Artwork, setSelectedImage] = useState({});
  const [audioFileName, setAudioFileName] = useState('');
  const [audioFileDuration, setAudioFileDuration] = useState('')
  const [audioFile, setAudioFile] = useState('')

  const openImage = async () => {
    let { type, uri } = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });
    if (type === "cancel") return;

    console.log(uri);
    setSelectedImage({ localURI: uri });
    //upload file
  };
  useEffect(() => {
    setArtist(db.selectedSong.artist);
    // setUrl(db.selectedSong.url);
    setTitle(db.selectedSong.title);
    setSelectedImage({ localURI: db.selectedSong.artwork });
  }, [db.selectedSong]);


  const handlePicker = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'audio/*' });
    setAudioFile(result.uri);
    setAudioFileName(result.name);
    const playbackObj = new Audio.Sound();
    const status = await playbackObj.loadAsync(
      { uri: result.uri },
    );
    setAudioFileDuration(status.durationMillis)
    await playbackObj.unloadAsync();
  }
  const handleUpdate = async () => {
    try {
      console.log(Artwork.localURI);
      // console.log(db.selectedSong.url);
      // console.log(Artwork.localURI !== db.selectedSong.url);
      if (Artwork.localURI !== db.selectedSong.artwork) {
        let id = firebase.firestore().collection("name").doc().id;
        const response = await fetch(Artwork.localURI);
        const blob = await response.blob();
        let ref = firebase
          .storage()
          .ref()
          .child("image/" + id);
        let upload = await ref.put(blob);
        let url = await ref.getDownloadURL();
        setSelectedImage({ localURI: url });
        console.log("ham zo day");
      }
      let payload = {
        id: db.selectedSong.id,
        title: Title,
        artwork: Artwork.localURI,
        artist: Artist,
      };
      console.log(payload);
      await mainApi.updateMusic(payload);
      dispatch(fetchCollection());
      return { id: id, url: url };
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Image source={{ uri: Artwork.localURI }} style={styles.img} />
      <TouchableOpacity style={styles.btn} onPress={openImage}>
        <Text>Choose your image</Text>
      </TouchableOpacity>
      <View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <Text style={[styles.txt, { marginHorizontal: 50 }]}>Title:</Text>
          <TextInput
            placeholder="Tên sản phẩm"
            style={styles.input}
            value={Title}
            onChangeText={(val) => setTitle(val)}
          />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <Text style={[styles.txt, { marginHorizontal: 50 }]}>Artist:</Text>
          <TextInput
            placeholder="Tên sản phẩm"
            style={styles.input}
            value={Artist}
            onChangeText={(val) => setArtist(val)}
          />
        </View>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <TouchableOpacity style={styles.btn} onPress={handlePicker}>
            <Text>Choose your audio file</Text>
          </TouchableOpacity>
          <TextInput
            editable={false}
            placeholder="new file name"
            style={[styles.input,{width:300}]}
            value={audioFileName}
          //onChangeText={(val) => setQuantity(val)}
          />
          <TextInput
            editable={false}
            placeholder="new duration"
            style={[styles.input, { marginVertical: 20, width:300 }]}
            value={audioFileDuration?(convertTime(audioFileDuration)).toString():""}
          //onChangeText={(val) => setQuantity(val)}
          />
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        ></View>
      </View>
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => {
          handleUpdate().then(() => navigation.navigate("Admin"));
        }}
      >
        <Text style={styles.btnText}> Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  img: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
  },

  title: {
    fontSize: 20,
    marginBottom: 20,
  },

  btn: {
    margin: 20,
  },
  submitBtn: {
    backgroundColor: "#2196f3",
    height: 45,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 10,
  },
  btnText: {
    color: "#FFFFFF",
  },
  icon: {
    width: 40,
    height: 40,
    backgroundColor: "#2196f3",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },

  input: {
    width: 200,
    height: 40,
    backgroundColor: "white",
    paddingLeft: 10,
  },

  txt: {
    color: "#2196f3",
    fontWeight: "bold",
  },
});
