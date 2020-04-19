import {CHANGE_FOCUS} from '../actions/types';

export default function(focus = null, action) {
  if (action.type === CHANGE_FOCUS) {
    console.log("hereree", action.payload.focus);
    return action.payload.focus;
  } else {
    return focus;
  }
}