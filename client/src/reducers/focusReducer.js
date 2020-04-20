import {CHANGE_FOCUS} from '../actions/types';

export default function(focus = null, action) {
  if (action.type === CHANGE_FOCUS) {
    return action.payload.focus;
  } else {
    return focus;
  }
}