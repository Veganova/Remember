import { GET_STARS, ADD_STAR, UPDATE_STAR, REMOVE_STAR, REMOVE_CHILDREN, UPDATE_LOCAL_STAR } from '../actions/types'
import { constructStars } from '../helpers.js';

// recieved stars (action.payload) wll have a correct index.
export default function(state = null, action) {
  const newState = JSON.parse(JSON.stringify(state));
  if (action.payload && action.payload.error) {
    return newState;
  }
  switch (action.type) {
    case ADD_STAR:
      const arg = {};
      const newStar = action.payload;
      arg[newStar.parentId] = [newStar];
      arg[newStar['_id']] = [];

      const formattedStar = constructStars(arg, newStar.parentId)[0];
      return addStar(newState, formattedStar);
    case UPDATE_STAR:
      return updateStar(newState, action.payload);
    case REMOVE_STAR:
      return removeStar(newState, action.payload);
    case REMOVE_CHILDREN:
      return removeStar(newState, action.payload);
    case UPDATE_LOCAL_STAR:
      for (let i = 0; i < newState.length; i++) {
        if (newState[i]['_id'] === action.payload.id) {
          newState[i].data = action.payload.data;
          return newState;
        }
      }
      alert("Update local star failed to find a star with id " + action.payload.id);
      // error message
      return state;
    default:
      return state;
  }
}
