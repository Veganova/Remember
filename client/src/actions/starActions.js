import axios from 'axios';
import {getRemoveStarChanges, getMoveStarChanges, getAddStarChanges} from './generateChanges';
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
  EDIT_STAR
} from './types';

let haltUpdates = false;

const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({type: FETCH_USER, payload: res.data});
};

const getStars = () => async dispatch => {
  const res = await axios.get('/api/star/get');
  dispatch({type: GET_STARS, payload: res.data});
};

const update = (dispatch, changes) => {
  if (!haltUpdates) {
    dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
    return true;
  } else {
    console.log("Denied update", changes);
  }
  return false;
};

const addStar = (stars, data, parentId, prevId, nextId) => async dispatch => {
  const changes = getAddStarChanges(stars, data, parentId, prevId, nextId);
  if (haltUpdates) {
    console.log("Denied update", changes);
    return false;
  }
  // No new change calls are permitted while add request is made. Test this.
  haltUpdates = true;
  const res = await axios.put('/api/star/updateChanges', {changes});
  haltUpdates = false;
  update(dispatch, res.data);
};

const updateStar = (id, update) => async dispatch => {
  const res = await axios.put('/api/star/update', {id, update});
  dispatch({type: UPDATE_STAR, payload: res.data});
};

// const updateStars = (currentStars, changedStars) => async dispatch => {
//
//   dispatch({type: UPDATE_LOCAL_STARS, payload: {changedStars}})
//   const res = await axios.put('/api/star/updateStars', {data: {currentStars, changedStars}});
//   dispatch({type: UPDATE_STARS, payload: res.data})
// };

// prev and next are the new ids
const moveStar = (stars, toMoveStarId, parentId, prevId, nextId) => async dispatch => {
  const changes = getMoveStarChanges(stars, toMoveStarId, parentId, prevId, nextId);
  console.log(changes);
  if (update(dispatch, changes)) {
    // update
  } else {
    return false;
  }
  // dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  // const res = await axios.put('/api/star/move', {prevId, nextId, starId});
  // dispatch({type: UPDATE_STAR, payload: res.data});
};

const removeStar = (stars, id) => async dispatch => {
  console.log(stars);
  const changes = getRemoveStarChanges(stars, id);
  if (update(dispatch, changes)) {
    // do rest
  } else {
    return false;
  }
  // dispatch({type: UPDATE_LOCAL_STARS, payload: {changes}});
  // const res = await axios.delete('/api/star/remove', {data: {id}});
  // dispatch({type: REMOVE_STAR, payload: res.data});
};

// uses parentId to check if it resides in the Trash (which would permanently delete it)
const removeChildren = (parentId) => async dispatch => {
  const res = await axios.delete('/api/star/removeChildren', {data: {parentId}});
  dispatch({type: REMOVE_CHILDREN, payload: res.data});
};

const updateLocalStar = (star, data) => dispatch => {
  dispatch({type: UPDATE_LOCAL_STAR, payload: {star, data}});
};

const clearFocus = () => dispatch => {
  dispatch({type: CLEAR_FOCUS, payload: {}});
};

const editStar = (id, update) => async dispatch => {
  const res = await axios.put('/api/star/update', {id, update});
  dispatch({type: EDIT_STAR, payload: res.data});
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
