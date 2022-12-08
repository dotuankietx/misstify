import mainApi from "../api/mainApi";
export const VIEWALL_SONG = "VIEWALL_SONG";
export const PLAY_SONG = "PLAY_SONG";
export const UPDATE_SONG_STATE = "UPDATE_SONG_STATE";
export const GETALL_SONG = "GETALL_SONG";

export const viewAllSong = (song) => {
  return {
    type: VIEWALL_SONG,
    payload: {
      songId: song.id,
      songTitle: song.title,
      songArtist: song.artist,
      songArtwork: song.artwork,
      songUrl: song.url,
    },
  };
};
export const getAllCollection = (songs) => {
  return {
    type: GETALL_SONG,
    payload: songs,
  };
};

export const fetchCollection = () => {
  return (dispatch) => {
    const fetchAll = async () => {
      const response = await mainApi.getAllCollection();
      dispatch(updateSongState({ songs: response.data }));
      // console.log(response.data);
    };
    fetchAll();
  };
};

export const playSong = (playbackObj, status, audio) => {
  return {
    type: PLAY_SONG,
    payload: {
      playbackObj: playbackObj,
      soundObj: status,
      currentAudio: audio,
    },
  };
};

export const updateSongState = (state) => {
  return {
    type: UPDATE_SONG_STATE,
    payload: {
      state: state,
    },
  };
};
