import { GET_STARS, ADD_STAR, REMOVE_STAR } from '../actions/types'

function getStarWithId(stars, id) {
  console.log("GET_STAR_ID", stars, id);
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

function addStars(state, stars) {
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    const dup = getStarWithId(state, star['_id']);
    if (dup) {
      console.log('DUP ADDED!');
      continue;
    }

    const parent = getStarWithId(state, star['parentId']);
    if (parent) {
      parent.childStars.push(star);
    } else {
      state.push(star);
    }
  }
  return state;
}

export default function(state = null, action) {
  switch (action.type) {
    case GET_STARS:
      return action.payload || [];
    case ADD_STAR:
      const newState = JSON.parse(JSON.stringify(state));
      return addStars(newState, action.payload);
    case REMOVE_STAR:
      return state;
    default:
      return state;
  }
}
