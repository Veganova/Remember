import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import starReducer from './starReducer';
import popupReducer from './popupReducer';
import lockReducer from "./lockReducer";
import focusReducer from "./focusReducer";

export default combineReducers({
  auth: authReducer,
  star: starReducer,
  popups: popupReducer,
  lock: lockReducer,
  focus: focusReducer,
  form: reduxForm
})
