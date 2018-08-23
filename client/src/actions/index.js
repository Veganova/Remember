import axios from 'axios';
import { FETCH_USER, GET_STARS, ADD_STAR } from './types';

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



export { fetchUser, getStars, addStar };
