import {ADD_POPUP, REMOVE_POPUP} from "../actions/types";

export default function(state = [], action) {
  switch (action.type) {
    case ADD_POPUP:
      let newStateAdd = JSON.parse(JSON.stringify(state));
      newStateAdd.push(action.payload);
      return newStateAdd;
    case REMOVE_POPUP:
      let newStateRemove = JSON.parse(JSON.stringify(state));
      const {popupType, message} = action.payload;
      for (let [index, popup] of newStateRemove.entries()) {
        if (popup.popupType === popupType && popup.message === message) {
          newStateRemove.splice(index, 1);
          return newStateRemove
        }
      }
      throw "popup for removal doesn't exist " + JSON.stringify(action.payload);
    default:
      return state;
  }
}