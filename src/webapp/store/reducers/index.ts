import { combineReducers } from 'redux';

import modal from './modal';
import taskInspectorReducer from './taskInspector';

export default combineReducers({
  modal,
  taskInspectorReducer,
});
