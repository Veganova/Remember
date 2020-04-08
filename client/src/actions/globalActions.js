import {ADD_POPUP, REMOVE_POPUP} from './types';

const addPopup = (message, popupType) => async dispatch => {
  dispatch({type: ADD_POPUP, payload: {message, popupType}});
}

const removePopup = (popup) => async dispatch => {
  dispatch({type: REMOVE_POPUP, payload: popup});
}

export {addPopup, removePopup};