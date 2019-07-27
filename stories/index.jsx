import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import { MuiThemeProvider } from '@material-ui/core/styles';
// import theme from 'lib/Theme';

storiesOf('Button', module)
  .add('with text', () => (
    <Button>Hello Button</Button>
  ))
  .add('with some emoji', () => (
    <Button><span aria-label="so cool" role="img">😀 😎 👍 💯</span></Button>
  ));


// storiesOf('Checklist', module)
//   .add('default', () => (
//     <MuiThemeProvider theme={theme}>
//       <Checklist checklistItems={checklistItems} title="Document Review" />
//     </MuiThemeProvider>
//   ));
