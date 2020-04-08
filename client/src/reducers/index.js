import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import starReducer from './starReducer';
import popupReducer from './popupReducer';
import localStarDataChangeReducer from "./localStarDataChangeReducer";

export default combineReducers({
  auth: authReducer,
  star: starReducer,
  sync: localStarDataChangeReducer,
  popups: popupReducer,
  form: reduxForm
})
