import axios from 'axios';
import {POPUP_TYPE} from "../components/general/Popup";
import _ from "lodash";
import {getRemoveStarChanges, getMoveStarChanges, getAddStarChanges, getEditStarChanges} from './generateChanges';
import {
  FETCH_USER,
  GET_STARS,
  ADD_STAR,
  UPDATE_STAR,
  UPDATE_STARS,
  REMOVE_STAR,
  REMOVE_CHILDREN,
  UPDATE_LOCAL_STAR,
  UPDATE_LOCAL_STARS,
  CLEAR_FOCUS,
  EDIT_STAR,
  ADD_LOCK,
  REMOVE_LOCK,
  ADD_POPUP
} from './types';

const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({type: FETCH_USER, payload: res.data});
};

const getStars = () => async dispatch => {
  const res = await axios.get('/api/star/get');
  dispatch({type: GET_STARS, payload: res.data});
};

// Returns false when the BE response is invvalid and contain errors. Also triggers a popup which will show in the UI to the user.
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

const addStar = (stars, data, parentId, prevId, nextId) => async dispatch => {
  const changes = getAddStarChanges(stars, data, parentId, prevId, nextId);
  // No new change calls are permitted while add request is made. Test this.
  dispatch({type: ADD_LOCK, payload: {changes}});
  const res = await updateRemoteAndCheck(dispatch, changes);
  if (res) {
    dispatch({type: UPDATE_LOCAL_STARS, payload: {changes: res.data}});
    dispatch({type: REMOVE_LOCK, payload: {changes}});
  }
};

// prev and next are the new ids
const moveStar = (stars, toMoveStarId, parentId, prevId, nextId) => async dispatch => {
  const changes = getMoveStarChanges(stars, toMoveStarId, parentId, prevId, nextId);
  dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  updateRemoteAndCheck(dispatch, changes);
};

const removeStar = (stars, id) => async dispatch => {
  const changes = getRemoveStarChanges(stars, id);
  dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  updateRemoteAndCheck(dispatch, changes);
};

const editStarRemote = _.debounce(updateRemoteAndCheck, 500);
const editStar = (stars, id, edits) => async dispatch => {
  const changes = getEditStarChanges(stars, id, edits);
  dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  editStarRemote(dispatch, changes);
};

// uses parentId to check if it resides in the Trash (which would permanently delete it)
const removeChildren = (parentId) => async dispatch => {
  const res = await axios.delete('/api/star/removeChildren', {data: {parentId}});
  dispatch({type: REMOVE_CHILDREN, payload: res.data});
};

const updateStar = (id, update) => async dispatch => {
  const res = await axios.put('/api/star/update', {id, update});
  dispatch({type: UPDATE_STAR, payload: res.data});
};


const updateLocalStar = (star, data) => dispatch => {
  dispatch({type: UPDATE_LOCAL_STAR, payload: {star, data}});
};

const clearFocus = () => dispatch => {
  dispatch({type: CLEAR_FOCUS, payload: {}});
};

export {
  fetchUser,
  getStars,
  addStar,
  updateStar,
  removeStar,
  removeChildren,
  updateLocalStar,
  clearFocus,
  editStar,
  moveStar
};
