import { echo } from './actions';

const doEcho = dispatch => (message) => dispatch(echo(message));

const operations = {
  doEcho,
};

export default operations;
