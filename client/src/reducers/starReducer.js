import { GET_STARS, ADD_STAR } from '../actions/types'

function getStarWithId(stars, id) {
  for (let i = 0; i < stars.length; i++) {
    if (id === stars[i]['_id']) {
      return stars[i];
    }
    let childStar = getStarWithId(stars[i].childStars, id);
    if (childStar) {
      return childStar;
    }
  }
  return null;
}

export default function(state = null, action) {
  console.log(action);
  switch (action.type) {
    case GET_STARS:
      return action.payload || [];
    case ADD_STAR:
      console.log("ADD_STAR", action);
      const dup = getStarWithId(state, action.payload['_id']);
      if (dup) {
        console.log('DUP ADDED!');
        return state;
      }

      const parent = getStarWithId(state, action.payload['parentId']);
      if (parent) {
        parent.childStars.push(action.payload);
      } else {
        state.push(action.payload);
      }
      console.log('NEW STATE', state);
      return state;
    default:
      return state;
  }
}
