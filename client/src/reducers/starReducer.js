import {GET_STARS, ADD_STAR, UPDATE_STAR, REMOVE_STAR, REMOVE_CHILDREN, UPDATE_LOCAL_STAR, CLEAR_FOCUS, EDIT_STAR } from '../actions/types'
import { constructStars } from '../helpers.js';
import {getById} from "../helpers";



// Function handles moving stars to trash and permentantly deletion
function removeStar(newState, removedStar) {
  if (removedStar.trashed) {
    let trashedId;
    for (let i = 0; i < newState.length; i++) {
      if (newState[i].data === 'Trash' && newState[i].parentId === newState[i].userId) {
        trashedId = newState[i]['_id'];
      }
    }
    if (!trashedId) {
      alert("No trash section");
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
   const newState = deleteStar(state, updatedStar)
   return addStar(newState, updatedStar);
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

/**
 * Uses the 'prev' and 'next' field in stars to compile a single list that contains the provided different linked lists
 * sorted. The result may vary but will always maintain the property that every linked list within is in the correct order.
 * O(n) time complexity.
 * @param stars A list of stars. There are many linked lists contained within this list.
 */
function linkSort(stars) {
  let byId = getById(stars);

  let result = [];
  let stack = [];
  stars.forEach(star => {
    if(!star.prev) {
      stack.push(star);
    }
  });
  while (stack.length > 0) {
    let curStar = stack.pop();

    result.push(curStar);

    if (curStar.next) {
      // Next id not null
      stack.push(byId[curStar.next]);
    }
  }

  return result;
}

// recieved stars (action.payload) wll have a correct index.
export default function(state = null, action) {
  const newState = JSON.parse(JSON.stringify(state));
  if (action.payload && action.payload.error) {
    return newState;
  }
  switch (action.type) {
    case GET_STARS:
      if (!action.payload) {
        return [];
      }
      return linkSort(action.payload);
    case ADD_STAR:
      const arg = {};
      const newStar = action.payload;
      arg[newStar.parentId] = [newStar];
      arg[newStar['_id']] = [];

      const formattedStar = constructStars(arg, newStar.parentId)[0];
      // For newly added - the input should focus so the user can type immediately
      newState.forEach(star=> star.focus = false);
      formattedStar.focus = true;
      return addStar(newState, formattedStar);
    case UPDATE_STAR:
      return updateStar(newState, action.payload);
    case REMOVE_STAR:
      return removeStar(newState, action.payload);
    case REMOVE_CHILDREN:
      return removeStar(newState, action.payload);
    case UPDATE_LOCAL_STAR:
      for (let i = 0; i < newState.length; i++) {
        if (newState[i]['_id'] === action.payload.star.id) {
          newState[i].data = action.payload.data;
          return newState;
        }
      }
      alert("Update local star failed to find a star with id " + action.payload.id);
      // error message
      return state;
    case CLEAR_FOCUS:
      newState.forEach(star => star.focus = false);
      return newState
    case EDIT_STAR:
      return state;
    default:
      return state;
  }
}
