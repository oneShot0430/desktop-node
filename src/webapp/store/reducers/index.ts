import { combineReducers } from 'redux';

import modal from './modal';
import taskInpector from './taskInspector';

export default combineReducers({
  modal,
  taskInpector,
});
