import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import starReducer from './starReducer';
import localStarDataChangeReducer from "./localStarDataChangeReducer";

export default combineReducers({
  auth: authReducer,
  star: starReducer,
  sync: localStarDataChangeReducer,
  form: reduxForm
})
