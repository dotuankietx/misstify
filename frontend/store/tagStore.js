import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import audioReducer from "../reducers/audioRducer.js";

const rootReducer = combineReducers({
  audio: audioReducer,
});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
