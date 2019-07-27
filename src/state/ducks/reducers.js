import { combineReducers } from 'redux';
import { reducers as sample } from './sample';

const rootReducer = combineReducers({
  sample,
});

export default rootReducer;
