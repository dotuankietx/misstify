import config from "../config";
import axios from "axios";
const mainUrl = `http://${config.HOST}:${config.PORT}/api/musics`;

const mainApi = {
  getAllCollection: () => {
    const url = mainUrl + "/";
    return axios.get(url);
  },
  postMusic: (payload) => {
    const url = mainUrl + "/addMusic";
    return axios.post(url, payload);
  },
  getMusic: (payload) => {
    const url = mainUrl + "/filterSong";
    console.log(`${url}?tittle=${payload}`);
    return axios.get(`${url}?title=${payload}`);
  },
  updateMusic: (payload) => {
    const url = mainUrl + "/editSong";
    console.log(url);
    return axios.post(url, payload);
  },
  deleteSong: (payload) => {
    const url = mainUrl + "/deleteSong";
    //console.log(`${url}?id=${payload.id}`);
    return axios.delete(`${url}?id=${payload.id}`);
    // return axios.delete(url, payload.id);
  },
};
export default mainApi;
