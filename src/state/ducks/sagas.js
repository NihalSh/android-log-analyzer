import { all } from 'redux-saga/effects';
import { combinedSaga as sampleSaga } from './sample';

export default function* rootSaga() {
  yield all([
    sampleSaga(),
  ]);
}
