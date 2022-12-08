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
import { firebase } from "../firebase.js";
import {
  getStorage,
  uploadString,
  uploadBytesResumable,
  getDownloadURL,
  ref,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { fetchCollection } from "../actions/songActions";
import { convertTime } from '../misc/audioController';


const ImagePickerDemo = ({ params }) => {
  const navigation = useNavigation();
  const [Artist, setArtist] = useState('');
  const [Title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState('')
  const [audioFileName, setAudioFileName] = useState('');
  const [audioFileDuration, setAudioFileDuration] = useState('')

  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState({
    localURI:
      "https://youshark.neocities.org/assets/img/default.png",
  });
  const openImage = async () => {
    let { type, uri } = await DocumentPicker.getDocumentAsync({
      type: "image/*",
    });
    if (type === "cancel") return;
    setSelectedImage({ localURI: uri });
  };

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

  const uploadImage = async () => {
    let id = firebase.firestore().collection("name").doc().id;
    const response = await fetch(selectedImage.localURI);
    const blob = await response.blob();
    let ref = firebase.storage().ref().child("image/" + id);
    let upload = await ref.put(blob);
    let artwork = await ref.getDownloadURL();
    return artwork
  }

  const uploadAudio = async () => {
    let id = firebase.firestore().collection('name').doc().id;
    const response = await fetch(audioFile);
    const blob = await response.blob();
    let ref = firebase.storage().ref().child("audio/" + id);
    let upload = await ref.put(blob);
    let url = await ref.getDownloadURL();
    console.log(audioFile)
    return url
  }

  const handleUpload = async () => {
    try {
      let url = await uploadAudio();
      let artwork = await uploadImage();
      let payload = {
        title: Title,
        artist: Artist,
        artwork: artwork,
        url: url,
        duration: audioFileDuration,
      };
      console.log(payload)

      await mainApi.postMusic(payload);
      dispatch(fetchCollection());
      return { id: id, url: url };
    } catch (error) { }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <Image source={{ uri: selectedImage.localURI }} style={styles.img} />
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
          <Text style={[styles.txt, { marginHorizontal: 50 }]}>Song name:</Text>
          <TextInput
            placeholder="song name"
            style={styles.input}
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
          <Text style={[styles.txt, { marginHorizontal: 50 }]}>artist:</Text>
          <TextInput
            placeholder="artist"
            style={styles.input}
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
            placeholder="file name"
            style={[styles.input,{width:300}]}
            value={audioFileName}
          //onChangeText={(val) => setQuantity(val)}
          />
          <TextInput
            editable={false}
            placeholder="duration"
            style={[styles.input, { marginVertical: 20, width:300 }]}
            value={audioFileDuration?(convertTime(audioFileDuration)).toString():""}
          //onChangeText={(val) => setQuantity(val)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => {
          handleUpload().then(() => navigation.navigate("Admin"));
        }}
      >
        <Text style={styles.btnText}> Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerDemo;

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
