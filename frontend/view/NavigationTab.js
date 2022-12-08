import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import SongList from "./SongList";
import MusicPlayer from "./MusicPlayer";
import Test from "./Test.js";
import AdminList from "./adminListSong";
import EditView from "./EditView";
import ImagePicker from "./ImagePicker";

const Tab = createBottomTabNavigator();
const NavigationTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AudioList"
        component={SongList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="headset-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Player"
        component={MusicPlayer}
        options={{
          //tabBarStyle:{display:"none"},
          tabBarButton: () => null,
        }}
      />
      <Tab.Screen
        name="Test"
        component={Test}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PostMusic"
        component={ImagePicker}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Admin"
        component={AdminList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Edit"
        component={EditView}
        options={{
          tabBarButton: () => null,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-music" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default NavigationTab;
