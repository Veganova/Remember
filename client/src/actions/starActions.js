import axios from 'axios';
import {POPUP_TYPE} from "../components/general/Popup";
import _ from "lodash";
import {
  getRemoveStarChanges,
  getMoveStarChanges,
  getAddStarChanges,
  getEditStarChanges,
  getRemoveAllStarsUnderParentChanges
} from '../utils/generateChanges';
import {
  FETCH_USER,
  GET_STARS,
  UPDATE_LOCAL_STARS,
  ADD_LOCK,
  REMOVE_LOCK,
  ADD_POPUP,
  CHANGE_FOCUS
} from './types';

// Returns false when the BE response is invaid and contain errors.
// Also triggers a popup which will show in the UI to the user.
const updateRemoteAndCheck = async (dispatch, changes) => {
  const res = await axios.put('/api/star/updateChanges', {changes});
  if (res.data.error) {
    console.error(res);
    dispatch({
      type: ADD_POPUP,
      payload: {message: `Service error: ${res.data.error.message}`, popupType: POPUP_TYPE.ERROR}
    });
    return false;
  }

  return res;
};

const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({type: FETCH_USER, payload: res.data});
};

const getStars = () => async dispatch => {
  const res = await axios.get('/api/star/get');
  dispatch({type: GET_STARS, payload: res.data});
};

// Add is different from other calls below. It updates remote first and then changes local.
const addStar = (stars, data, parentId, prevId, nextId) => async dispatch => {
  const changes = getAddStarChanges(stars, data, parentId, prevId, nextId);
  // No new change calls are permitted while add request is made. Test this.
  dispatch({type: ADD_LOCK, payload: {changes}});
  const res = await updateRemoteAndCheck(dispatch, changes);
  dispatch({type: REMOVE_LOCK, payload: {changes}});
  if (res) {
    const temporaryKey = Object.keys(res.data)[0];
    const focus = res.data[temporaryKey]['saved']._id;
    dispatch({type: UPDATE_LOCAL_STARS, payload: {changes: res.data}});
    dispatch({type: CHANGE_FOCUS, payload: {focus}});
  }
};

// prev and next are the new ids
const moveStar = (stars, toMoveStarId, parentId, prevId, nextId) => async dispatch => {
  const changes = getMoveStarChanges(stars, toMoveStarId, parentId, prevId, nextId);
  const toMoveStar = changes[toMoveStarId]['current'];
  dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  if (toMoveStar.parentId !== toMoveStar.userId) {
    dispatch({type: CHANGE_FOCUS, payload: {focus:  toMoveStarId}});
  }
  updateRemoteAndCheck(dispatch, changes);
};

const removeStar = (stars, id) => async dispatch => {
  const starsCopied = JSON.parse(JSON.stringify(stars));
  const changes = getRemoveStarChanges(starsCopied, id);
  const removalStar = changes[id]['current'];
  // TODO #17: don't know why this works but it does. Investigate.
  const focus = removalStar._id; //next || removalStar.prev;
  dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  dispatch({type: CHANGE_FOCUS, payload: {focus}});
  updateRemoteAndCheck(dispatch, changes);
};

const editStarRemote = _.debounce(updateRemoteAndCheck, 500);
const editStar = (stars, id, edits) => async dispatch => {
  const changes = getEditStarChanges(stars, id, edits);
  dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  editStarRemote(dispatch, changes);
};

// uses parentId to check if it resides in the Trash (which would permanently delete it)
const removeChildren = (stars, parentId) => async dispatch => {
  const starsCopied = JSON.parse(JSON.stringify(stars));
  const changes = getRemoveAllStarsUnderParentChanges(starsCopied, parentId);
  dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  updateRemoteAndCheck(dispatch, changes);
};

export {
  fetchUser,
  getStars,
  addStar,
  removeStar,
  removeChildren,
  editStar,
  moveStar
};
