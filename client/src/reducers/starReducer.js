import { GET_STARS } from '../actions/types'

export default function(state = null, action) {
  console.log(action);
  switch (action.type) {
    case GET_STARS:
      return action.payload || [];
    default:
      return state;
  }
}
