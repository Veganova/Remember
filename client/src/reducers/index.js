import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';
import authReducer from './authReducer';
import starReducer from './starReducer';

export default combineReducers({
  auth: authReducer,
  star: starReducer,
  form: reduxForm
})
