import {GET_STARS, UPDATE_LOCAL_STARS } from '../actions/types'
import {getById} from "../utils/helpers";
import {applyChanges} from "../utils/applyChanges";

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
      console.log(action.payload);
      return linkSort(action.payload);
    case UPDATE_LOCAL_STARS:
      const { changes } = action.payload;
      return applyChanges(newState, changes);
    default:
      return state;
  }
}
