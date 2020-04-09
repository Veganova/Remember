import {ADD_POPUP, REMOVE_POPUP, ADD_LOCK, REMOVE_LOCK} from './types';

const addPopup = (message, popupType) => async dispatch => {
  dispatch({type: ADD_POPUP, payload: {message, popupType}});
}

const removePopup = (popup) => async dispatch => {
  dispatch({type: REMOVE_POPUP, payload: popup});
}

const addLock = (changes) => async dispatch => {
  dispatch({type: ADD_LOCK, payload: {changes}});
}

const removeLock = (changes) => async dispatch => {
  dispatch({type: REMOVE_LOCK, payload: {changes}});
}

export {addPopup, removePopup};