import * as R from 'ramda';

const getEchoMessage = R.pathOr('Nothing', ['sample', 'message']);

const selectors = {
  getEchoMessage,
};

export default selectors;
