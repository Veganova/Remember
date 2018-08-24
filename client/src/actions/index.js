import axios from 'axios';
import { FETCH_USER, GET_STARS, ADD_STAR, REMOVE_STAR } from './types';

const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
}

const getStars = () => async dispatch => {
  const res = await axios.get('/api/star/get');
  dispatch({ type: GET_STARS, payload: res.data });
}

const addStar = (parentId, data) => async dispatch => {
  const res = await axios.post('/api/star/add', {parentId, data});
  dispatch({ type: ADD_STAR, payload: res.data });
}

const removeStar = (id) => async dispatch => {
  console.log("REMOVING STAR ACTION", id);
  const res = await axios.delete('/api/star/remove', { data: {id}});
  dispatch({ type: REMOVE_STAR, payload: res.data });
}



export { fetchUser, getStars, addStar, removeStar };
