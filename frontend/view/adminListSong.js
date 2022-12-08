import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
import { useDispatch, useSelector } from "react-redux";
import { fetchCollection, updateSongState } from "../actions/songActions";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
const AdminList = ({ params }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const db = useSelector((store) => store.audio);
  const [data, setData] = useState([]);
  useEffect(() => {
    dispatch(fetchCollection());
    //setData(db.songs);
  }, []);
  const handleSelectSong = (song) => {
    dispatch(updateSongState({ selectedSong: song }));
    navigation.navigate("Edit");
  };
  return (
    <View style={{ backgroundColor: color.APP_BG, height: "100%" }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={db.songs}
        renderItem={({ item }) => {
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  handleSelectSong(item);
                }}
                style={{
                  borderRadius: 10,

                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.item}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Image
                      source={{ uri: item.artwork }}
                      style={{ width: 120, height: 120, borderRadius: 10 }}
                    />
                    <View style={{ paddingHorizontal: 25 }}>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.description}>{item.artist}</Text>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          paddingTop: 5,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            handleSelectSong(item);
                          }}
                        >
                          <AntDesign name="edit" size={24} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.divider}></View>
            </>
          );
        }}
      />
    </View>
  );
};

export default AdminList;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#13103B",
    alignItems: "center",
    justifyContent: "center",
  },
  //divider
  divider: {
    height: 1,
    width: width,
    backgroundColor: "#13103B",
    marginVertical: 5,
  },
  item: {
    padding: 20,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  description: {
    marginTop: 5,
    color: "#BEBDDD",
  },
  dot: {
    fontWeight: "bold",
    fontSize: 20,
    marginHorizontal: 5,
    color: "#E78D7E",
  },
  navButton: {
    width: "33%",
    height: 100,
    fontSize: 100,
    color: "red",
    margin: 10,
    padding: 10,
  },
  input: {
    height: 40,
    backgroundColor: "white",
    width: width - 40,
    borderRadius: 5,
    fontSize: 16,
    paddingLeft: 10,
  },
});
