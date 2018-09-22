import axios from 'axios';
import {FETCH_USER, GET_STARS, ADD_STAR, UPDATE_STAR, REMOVE_STAR, REMOVE_CHILDREN, UPDATE_LOCAL_STAR, CLEAR_FOCUS} from './types';

const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

const getStars = () => async dispatch => {
  const res = await axios.get('/api/star/get');
  dispatch({ type: GET_STARS, payload: res.data });
};

const addStar = (parentId, data, index) => async dispatch => {
  const res = await axios.post('/api/star/add', {parentId, data, index});
  dispatch({ type: ADD_STAR, payload: res.data });
};

const updateStar = (id, update) => async dispatch => {
  const res = await axios.put('/api/star/update', {id, update});
  dispatch({ type: UPDATE_STAR, payload: res.data });
};

const removeStar = (id) => async dispatch => {
  const res = await axios.delete('/api/star/remove', { data: { id }});
  dispatch({ type: REMOVE_STAR, payload: res.data });
};

// uses parentId to check if it resides in the Trash (which would permanentatly delete it)
const removeChildren = (parentId) => async dispatch => {
  const res = await axios.delete('/api/star/removeChildren', { data: {parentId}});
  dispatch({ type: REMOVE_CHILDREN, payload: res.data });
};

const updateLocalStar = (star, data) => dispatch => {
  dispatch({ type: UPDATE_LOCAL_STAR, payload: { star, data }});
};

const clearFocus = () => dispatch => {
  dispatch({ type: CLEAR_FOCUS, payload: {}});
}


export { fetchUser, getStars, addStar, updateStar, removeStar, removeChildren, updateLocalStar, clearFocus };
