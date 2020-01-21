const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const server = require('./server');
const Database = require('./server/models/mydb');


const path = require('path');
const url = require('url');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({ width: 1000, height: 800 });
  
  mainWindow.loadURL('http://localhost:3000/');
  // mainWindow.loadURL(url.format({
  //   pathname: path.join(__dirname, 'index.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  Database.createDB();
  if (mainWindow === null) {
    createWindow();
  }
});
