/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
// import React from 'react';
// import ReactDOM from 'react-dom';

// import './index.css';

// console.log('👋 This message is being logged by "renderer.js", included via webpack');

// ReactDOM.render(
//   <span styleName="custom">this works!</span>,
//   document.getElementById('app'),
// );


import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './state';
import App from 'containers/App';
import VirtualScrollWindow from 'components/VirtualScrollWindow';

const store = configureStore();

function getFile() {
  const { dialog } = require('electron').remote;
  const fileName = dialog.showOpenDialog({ properties: ['openFile'] });
  console.log(fileName);
  return fileName && fileName[0];
}

const fileName = getFile();
let fileData = "";

function getNextRow(lastRowReceived) {
  const index = lastRowReceived + 1;
  if (index >= fileData.length) {
    return null;
  }
  return fileData[index];
}

if (fileName) {
  const fs = require('fs');
  const stream = fs.createReadStream(fileName);
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
    console.log(chunk.toString());
    fileData += chunk.toString();
  });
  stream.on('end', () => {
    fileData = fileData.split(/\r?\n/);
    console.log('There will be no more data.');
    console.log(fileData);

    ReactDOM.render(
      <Provider store={store}>
        {/* <App /> */}
        <VirtualScrollWindow getNextRow={getNextRow} rowCount={fileData.length} />
      </Provider>,
      document.getElementById('app'),
    );
  });
  // stream.read(10);
  // console.log(stream.toString()[0]);
}
