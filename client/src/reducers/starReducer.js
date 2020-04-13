import {GET_STARS, ADD_STAR, UPDATE_STAR, UPDATE_STARS, REMOVE_STAR, REMOVE_CHILDREN, UPDATE_LOCAL_STAR, UPDATE_LOCAL_STARS, CLEAR_FOCUS, EDIT_STAR } from '../actions/types'
import { constructStars } from '../helpers.js';
import {getById} from "../helpers";



function updateStarByChange(stars, targetStar, change) {
  let isFocusChanged = false;
  console.log(change);
  if (change["operation"] === "update") {
    for (const changedKey in change["changed"]) {
      targetStar[changedKey] = change["changed"][changedKey];
      if (changedKey === 'focus') {
        isFocusChanged = true;
      }
    }
    return stars;
  } else if (change["operation"] === "delete") {
    return deleteStar(stars, targetStar);
  } else if (change["operation"] === "add") {
    isFocusChanged = true;
    if (!("saved" in change)) {
      // ID generation is left to backend. Will not create any stars locally
      throw 'Add operation not implemented for updating local state ' + JSON.stringify(change);
    }
    // must sort list after adding this!
    stars.push({...change["saved"], focus: true});
    // stars[stars.length - 1].focus = true;
    return stars;
  }
  // The focus has changed
  if (isFocusChanged) {
    stars.forEach(star => {
      if (star._id !== targetStar._id) {
        star.focus = false;
      }
    });
  }
  throw 'No such operation ' + JSON.stringify(change);
}

// Function handles moving stars to trash and permanently deletion
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
  return newState.filter(star => removedStar['_id'] !== star['_id']);
}

// If star does not exist, it will simply add
function updateStar(state, updatedStar) {
   const newState = deleteStar(state, updatedStar)
   return addStar(newState, updatedStar);
}

function addStar(newState, formattedStar) {
  let previousLength = newState.length;
  console.log("before", newState);
  // with no previous link, putting it at the front of the list is safe.
  if (formattedStar.prev === null) {
    newState.unshift(formattedStar);
  }
  for (let i = 0; i < newState.length; i++) {
    if (formattedStar.prev === newState[i]['_id']) {
      newState.splice(i + 1, 0, formattedStar);
      break;
    }
  }

  console.log("after", newState);
  if (newState.length === previousLength) {
    alert('add star reducer did not add element to state');
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

// receives affected star(s) in action.payload
export default function(state = null, action) {
  let newState = JSON.parse(JSON.stringify(state));
  if (action.payload && action.payload.error) {
    return newState;
  }
  switch (action.type) {
    case GET_STARS:
      if (!action.payload) {
        return [];
      }
      console.log(action.payload);
      return linkSort(action.payload);
    case ADD_STAR:
      for (let i = 0; i < action.payload.length; i++) {
        newState = updateStar(newState, action.payload[i]);
      }
      newState.forEach(star => {
        star.focus = false
      });

      action.payload[action.payload.length - 1].focus = true;
      return newState;
      // const arg = {};
      // const newStar = action.payload;
      // arg[newStar.parentId] = [newStar];
      // arg[newStar['_id']] = [];
      //
      // const formattedStar = constructStars(arg, newStar.parentId)[0];
      // // For newly added - the input should focus so the user can type immediately
      // return addStar(newState, formattedStar);
    case UPDATE_STAR:
      return updateStar(newState, action.payload);
    case UPDATE_STARS:
      // for (let star in action.payload) {
      //   newState = updateStar(newState, star);
      // }
      return newState;
    case REMOVE_STAR:
      return removeStar(newState, action.payload);
    case REMOVE_CHILDREN:
      return removeStar(newState, action.payload);
    case UPDATE_LOCAL_STAR:
      for (let i = 0; i < newState.length; i++) {
        if (newState[i]['_id'] === action.payload.star._id) {
          newState[i].data = action.payload.data;
          return newState;
        }
      }
      alert("Update local star failed to find a star with id " + action.payload._id);
      // error message
      return state;
    case UPDATE_LOCAL_STARS:
      let byId = getById(newState);
      const { changes } = action.payload;
      let allSimpleEdit = true;
      for (let changedStarId in changes) {
        const change = changes[changedStarId];
        if (!change.isSimpleEdit) {
          allSimpleEdit = false;
        }
        const targetStar = byId[changedStarId];
        newState = updateStarByChange(newState, targetStar, change);
      }
      if (allSimpleEdit) {
        // No need to sort when all edits are 'simple'
        console.log("Simple edit found. No sort required");
        return newState;
      }
      return linkSort(newState);
    case CLEAR_FOCUS:
      newState.forEach(star => star.focus = false);
      return newState;
    case EDIT_STAR:
      return state;
    default:
      return state;
  }
}
