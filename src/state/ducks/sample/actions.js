import { ECHO } from './types';

const echo = (message) => ({
  type: ECHO,
  payload: message,
});

export {
  echo,
};
