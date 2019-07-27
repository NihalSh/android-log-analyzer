import {
  takeEvery,
  all,
} from 'redux-saga/effects';
import {
  ECHO_SAGA,
} from './types';

function* processEchoEvent(action) {
  try {

  } catch (e) {

  }
}

function* watchEchoEvent() {
  yield takeEvery(ECHO_SAGA, processEchoEvent);
}

export function* combinedSaga() {
  yield all([
    watchEchoEvent(),
  ]);
}

