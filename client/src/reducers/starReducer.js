import { GET_STARS, ADD_STAR, UPDATE_STAR, REMOVE_STAR } from '../actions/types'

function removeStar(state, removedStar) {
  const newState = JSON.parse(JSON.stringify(state));
  const newerState = newState.filter(star => removedStar['_id'] !== star['_id']);
  return newerState;
}

function updateStar(state, updatedStar) {
   const newState = removeStar(state, updatedStar)
   newState.push(updatedStar);
   return newState;
}

export default function(state = null, action) {
  switch (action.type) {
    case GET_STARS:
      return action.payload || [];
    case ADD_STAR:
      const newState = JSON.parse(JSON.stringify(state));
      newState.concat(action.payload);
      return newState;
    case UPDATE_STAR:
      return updateStar(state, action.payload);
    case REMOVE_STAR:
      return updateStar(state, action.payload);
    default:
      return state;
  }
}
