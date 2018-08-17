import axios from 'axios';
import { FETCH_USER, GET_STARS } from './types';

const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
}

const getStars = () => async dispatch => {
  const res = await axios.get('/api/star/get');
  dispatch({ type: GET_STARS, payload: res.data });
}

export { fetchUser, getStars };
