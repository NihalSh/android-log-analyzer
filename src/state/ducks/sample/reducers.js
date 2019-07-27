import {
  ECHO
} from './types';

function reducer(state = {}, action) {
  switch (action.type) {
    case ECHO:
      return {
        ...state,
        message: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
