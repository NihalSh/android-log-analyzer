import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import VirtualScrollWindow from '../src/components/VirtualScrollWindow';
import { MuiThemeProvider } from '@material-ui/core/styles';
// import theme from 'lib/Theme';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button><span aria-label="so cool" role="img">😀 😎 👍 💯</span></Button>
  ));

const TOTAL_ROWS = 500;

function getNextRow(lastRowReceived) {
  if (lastRowReceived >= -1 && lastRowReceived < TOTAL_ROWS)
    return (lastRowReceived + 1) + '';
  return null;
}

storiesOf('VirtualScrollWindow', module)
  .add('default', () => (
    <VirtualScrollWindow getNextRow={getNextRow} rowCount={TOTAL_ROWS} />
  ));
// storiesOf('Checklist', module)
//   .add('default', () => (
//     <MuiThemeProvider theme={theme}>
//       <Component />
//     </MuiThemeProvider>
//   ));
