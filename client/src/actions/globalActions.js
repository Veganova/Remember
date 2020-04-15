import {ADD_POPUP, REMOVE_POPUP, CHANGE_FOCUS} from './types';

const addPopup = (message, popupType) => async dispatch => {
  dispatch({type: ADD_POPUP, payload: {message, popupType}});
}

const removePopup = (popup) => async dispatch => {
  dispatch({type: REMOVE_POPUP, payload: popup});
}

const changeFocus = (focus) => async dispatch => {
  dispatch({type: CHANGE_FOCUS, payload: {focus}});
}

export {addPopup, removePopup, changeFocus};