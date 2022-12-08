import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  Pressable,
  StatusBar,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import color from "../misc/color";
import { Entypo } from "@expo/vector-icons";
import {
  fetchCollection,
  updateSongState,
  viewAllSong,
} from "../actions/songActions";
import { Audio } from "expo-av";
import { useEffect } from "react";

const getThumbnailText = (filename) => filename[0];

const SongList = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // const [data, setData] = useState([]);
  const db = useSelector((store) => store.audio);
  const [modalVisible, setModalVisible] = useState(false);
  const haddleSelectSong = (song) => {
    dispatch(viewAllSong(song));
  };
  const haddlePlaySong = (state) => {
    dispatch(updateSongState(state));
  };
  const handleAudioPress = async (audio) => {
    //playing audio for the 1st time
    if (db.soundObj === null) {
      const playbackObj = new Audio.Sound();
      const status = await playbackObj.loadAsync(
        { uri: audio.url },
        { shouldPlay: true }
      );
      const index = db.songs.indexOf(audio);
      return haddlePlaySong({
        playbackObj: playbackObj,
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        cunrentAudioIndex: index,
      });
    }
    //pause audio
    if (
      db.soundObj.isLoaded &&
      db.soundObj.isPlaying &&
      db.currentAudio.id === audio.id
    ) {
      const status = await db.playbackObj.setStatusAsync({ shouldPlay: false });
      return haddlePlaySong({ soundObj: status, isPlaying: false });
    }
    //resume audio
    if (
      db.soundObj.isLoaded &&
      !db.soundObj.isPlaying &&
      db.currentAudio.id === audio.id
    ) {
      const status = await db.playbackObj.playAsync();
      return haddlePlaySong({ soundObj: status, isPlaying: true });
    }
    //select another audio
    if (db.soundObj.isLoaded && db.currentAudio.id !== audio.id) {
      await db.playbackObj.stopAsync();
      await db.playbackObj.unloadAsync();
      const status = await await db.playbackObj.loadAsync(
        { uri: audio.url },
        { shouldPlay: true }
      );
      const index = db.songs.indexOf(audio);
      return haddlePlaySong({
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        cunrentAudioIndex: index,
      });
    }
  };
  const renderPlayPauseIcon = (isPlaying) => {
    if (isPlaying)
      return <Entypo name="controller-paus" size={24} color="black" />;
    return <Entypo name="controller-play" size={24} color="black" />;
  };
  const convertTime = (duration) => {
    if (duration) {
      const hrs = duration / 60000;
      const minute = hrs.toString().split(".")[0];
      const percent = hrs - parseInt(minute);
      const sec = Math.ceil(60 * percent);
      if (parseInt(minute) < 10 && sec < 10) {
        return `0${minute}:0${sec}`;
      }

      if (parseInt(minute) < 10) {
        return `0${minute}:${sec}`;
      }

      if (sec < 10) {
        return `${minute}:0${sec}`;
      }
      return `${minute}:${sec}`;
    }
  };
  useEffect(() => {
    dispatch(fetchCollection());

    //console.log(db.songs);
  }, []);
  return (
    <View style={{ backgroundColor: color.APP_BG, height: "100%" }}>
      <FlatList
        data={db.songs}
        renderItem={({ item, index }) => {
          return item != null ? (
            <>
              <View style={styles.container}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    haddlePlaySong({ cunrentAudioIndex: index });
                    navigation.navigate("Player");
                  }}
                >
                  <View style={styles.leftContainer}>
                    <View style={styles.thumbnail}>
                      <Text style={styles.thumbnailText}>
                        {db.cunrentAudioIndex === index
                          ? renderPlayPauseIcon(db.isPlaying)
                          : getThumbnailText(item.title)}
                      </Text>
                    </View>
                    <View style={styles.titleContainer}>
                      <Text numberOfLines={1} style={styles.title}>
                        {item.title} - {item.artist}
                      </Text>
                      <Text style={styles.timeText}>
                        {convertTime(item.duration)}
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                  <Entypo
                    onPress={() => {
                      haddleSelectSong(item);
                      setModalVisible(true);
                    }}
                    name="dots-three-vertical"
                    size={24}
                    color={color.FONT_MEDIUM}
                    style={{ padding: 10 }}
                  />
                </View>
              </View>
              <View style={styles.separator} />
            </>
          ) : (
            <View>
              <Text>No songs</Text>
            </View>
          );
        }}
      />
      <>
        <StatusBar hidden={true} />
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modal}>
            <Text style={styles.modalTtitle} numberOfLines={2}>
              {db.currentSong.songTitle}
            </Text>
            <View style={styles.optionContainer}>
              <TouchableWithoutFeedback onPress={{}}>
                <Text style={styles.option}>Play</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={{}}>
                <Text style={styles.option}>Add to Playlist</Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <View onPress={{}} style={styles.modalBg} />
          </TouchableWithoutFeedback>
        </Modal>
      </>
    </View>
  );
};

export default SongList;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: width - 80,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: 50,
    flexBasis: 50,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
  separator: {
    width: width - 80,
    backgroundColor: "white",
    opacity: 0.3,
    height: 0.5,
    alignSelf: "center",
    marginTop: 10,
  },
  timeText: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },

  modal: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: color.APP_BG,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 1000,
  },
  optionContainer: {
    padding: 20,
  },
  modalTtitle: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
    paddingBottom: 0,
    color: color.FONT_MEDIUM,
  },
  option: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.FONT,
    paddingVertical: 10,
    letterSpacing: 1,
  },
  modalBg: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: color.MODAL_BG,
  },
});
