import _ from "lodash";
import {ADD_LOCK, REMOVE_LOCK} from "../actions/types";

export default function(state = [], action) {
  switch (action.type) {
    case ADD_LOCK:
      let newStateAdd = JSON.parse(JSON.stringify(state));
      newStateAdd.push(action.payload.changes);
      return newStateAdd;
    case REMOVE_LOCK:
      let newStateRemove = JSON.parse(JSON.stringify(state));
      const targetChange = action.payload.changes;
      for (let [index, change] of newStateRemove.entries()) {
        if (_.isEqual(change, targetChange)) {
          newStateRemove.splice(index, 1);
          return newStateRemove
        }
      }
      throw "Lock change for removal doesn't exist " + JSON.stringify(action.payload);
    default:
      return state;
  }
}