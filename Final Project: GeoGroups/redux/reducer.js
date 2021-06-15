import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";

import { RESET_USER, UPDATE_USER, JOIN_GROUP, LEAVE_GROUP } from "./actions";

const merge = (prev, next) => Object.assign({}, prev, next);

const userReducer = (state = {}, action) => {
  switch (action.type) {
    case RESET_USER:
      return {};
    case UPDATE_USER:
      return merge(state, action.payload);
    case JOIN_GROUP:
      // action.payload is id
      const groups = {[action.payload]: true, ...state.groups}
      return {...state, groups: groups}
    case LEAVE_GROUP:
      // action.payload is id
      delete state.groups[action.payload]
      return {...state}
    default:
      return state;
  }
};

const reducer = combineReducers({
  firebase: firebaseReducer,
  user: userReducer,
});

export default reducer;
