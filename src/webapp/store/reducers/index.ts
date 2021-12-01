import { combineReducers } from 'redux';

import modal from './modal';
import taskInspector from './taskInspector';

export default combineReducers({
  modal,
  taskInspector,
});
