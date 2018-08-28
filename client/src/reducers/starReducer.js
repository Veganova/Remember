import { GET_STARS, ADD_STAR, UPDATE_STAR, REMOVE_STAR, REMOVE_CHILDREN } from '../actions/types'
import { constructStars } from '../helpers.js';



// Function handles moving stars to trash and permentantly deletion
function removeStar(newState, removedStar) {
  console.log("REMOVE_STAR:", removedStar);
  if (removedStar.trashed) {
    let trashedId;
    for (let i = 0; i < newState.length; i++) {
      if (newState[i].data === 'Trash' && newState[i].parentId === newState[i].userId) {
        trashedId = newState[i]['_id'];
      }
    }
    if (!trashedId) {
      console.log("No trash section");
    }
    for (let i = 0; i < removedStar.trashed.length; i++) {
      for (let k = 0; k < newState.length; k++) {
        if (removedStar.trashed[i] === newState[k]['_id']) {
           newState[k].parentId = trashedId;
        }
      }
    }
    return newState;
  }

  if (removedStar.deleted) {
    for (let i = 0; i < removedStar.deleted.length; i++) {
      newState = deleteStar(newState, { '_id': removedStar.deleted[i] });
    }
    return newState;
  }
  // move totrash
  return updateStar(newState, removedStar);
}

function deleteStar(newState, removedStar) {
  const newerState = newState.filter(star => removedStar['_id'] !== star['_id']);
  return newerState;
}

function updateStar(state, updatedStar) {
    console.log("1", state);
   const newState = deleteStar(state, updatedStar)
   console.log("2", state);
   newState.push(updatedStar);
   // addStar(state, updatedStar);
   return newState;
}

function addStar(newState, formattedStar) {
  let previousLength = newState.length;
  for (let i = 0; i < newState.length; i++) {
    if (formattedStar.index < newState[i].index) {
      newState.splice(i, 0, formattedStar);
      break;
    }
  }

  if (newState.length === previousLength) {
    newState.push(formattedStar);
  }
  return newState;
}

// recieved stars (action.payload) wll have a correct index.
export default function(state = null, action) {
  const newState = JSON.parse(JSON.stringify(state));
  console.log(action);
  if (action.payload && action.payload.error) {
    return newState;
  }
  switch (action.type) {
    case GET_STARS:
      return action.payload || [];
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
    default:
      return state;
  }
}
