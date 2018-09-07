import { GET_STARS, ADD_STAR, UPDATE_STAR, REMOVE_STAR, REMOVE_CHILDREN, UPDATE_LOCAL_STAR } from '../actions/types'
import { constructStars } from '../helpers.js';

// state is a mapping of starId -> difference in data
export default function(state = {}, action) {
  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    // Adding a new star will not change
    case ADD_STAR:
      return newState;
    case UPDATE_STAR:
      if (newState[action.payload['_id']]) {
        delete newState[action.payload['_id']];
      }
      return newState;
    case REMOVE_STAR:
      if (newState[action.payload['_id']]) {
        delete newState[action.payload['_id']];
      }
      return newState;
    case REMOVE_CHILDREN:
      const removedStars = action.payload.result;
      for (let i = 0; i < removedStars.length; i++) {
        if (newState[removedStars[i]['_id']]) {
          delete newState[removedStars[i]['_id']];
        }
      }
      return newState;
    case UPDATE_LOCAL_STAR:
      if (!newState[action.payload.star.id]) {
        newState[action.payload.star.id] = {
          "oldData": action.payload.star.data,
          "newData": action.payload.data
        }
      } else if (newState[action.payload.star.id]["oldData"] === action.payload.data) {
        if (newState[action.payload.star.id]) {
          delete newState[action.payload.star.id];
        }
      } else {
        newState[action.payload.star.id].newData = action.payload.data;
      }
      return newState;
    default:
      return state;
  }
}
