import {
  VIEWALL_SONG,
  PLAY_SONG,
  UPDATE_SONG_STATE,
  GETALL_SONG,
} from "../actions/songActions";

const initialState = {
  songs: [
    // {
    //   id: 1,
    //   title: "19th Floor",
    //   artist: "Bobby Richards",
    //   artwork: require("../assets/img/img1.jpg"),
    //   url: "https://firebasestorage.googleapis.com/v0/b/mp3-database.appspot.com/o/audio%2F6KP7dXCj2XydLGSm16KG?alt=media&token=52319d99-0736-4873-93cd-d979c2c8613e",
    //   duration: 18000,
    // },
    // {
    //   id: 2,
    //   title: "Awful",
    //   artist: "josh pan",
    //   artwork: require("../assets/img/img2.jpg"),
    //   url: "https://firebasestorage.googleapis.com/v0/b/reactnative-redux.appspot.com/o/images%2Ftest.mp3?alt=media&token=c058b3e8-5423-48c9-9289-968c8e7a431a",
    //   duration: 185051,
    // },
    // {
    //   id: 3,
    //   title: "Something is Going On",
    //   artist: "Godmode",
    //   artwork: require("../assets/img/img3.jpg"),
    //   url: "https://firebasestorage.googleapis.com/v0/b/mp3-database.appspot.com/o/audio%2F6KP7dXCj2XydLGSm16KG?alt=media&token=52319d99-0736-4873-93cd-d979c2c8613e",
    //   duration: 185051,
    // },
    // {
    //   id: 4,
    //   title: "Book The Rental Wit It",
    //   artist: "RAGE",
    //   artwork: require("../assets/img/img4.jpg"),
    //   url: "https://firebasestorage.googleapis.com/v0/b/reactnative-redux.appspot.com/o/images%2Ftest.mp3?alt=media&token=c058b3e8-5423-48c9-9289-968c8e7a431a",
    //   duration: 185051,
    // },
    // {
    //   id: 5,
    //   title: "Crimson Fly",
    //   artist: "Huma-Huma",
    //   artwork: require("../assets/img/img5.jpg"),
    //   url: "https://firebasestorage.googleapis.com/v0/b/reactnative-redux.appspot.com/o/images%2Ftest.mp3?alt=media&token=c058b3e8-5423-48c9-9289-968c8e7a431a",
    //   duration: 185051,
    // },
  ],
  currentSong: {},
  playbackObj: null,
  soundObj: null,
  currentAudio: {},
  isPlaying: false,
  cunrentAudioIndex: null,
  activeListItem: false,
  selectedSong: {},
};

const tagReducer = (state = initialState, action) => {
  switch (action.type) {
    case VIEWALL_SONG:
      return {
        ...state,
        currentSong: action.payload,
      };
    case GETALL_SONG:
      return {
        ...state,
        currentSong: action.payload,
      };
    case PLAY_SONG:
      return {
        ...state,
        playbackObj: action.payload.playbackObj,
        soundObj: action.payload.soundObj,
        currentAudio: action.payload.currentAudio,
      };
    case UPDATE_SONG_STATE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return { ...state };
  }
};

export default tagReducer;
