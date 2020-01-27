// const express = require('express');
// const app = express();
// const Router = require('electron-router');
// const app = Router('main');
const { ipcMain } = require('electron')
// const path = require('path');
// const bodyParser = require('body-parser');
// const port = process.env.PORT || 5000;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

require('./server/config/routes')(ipcMain);
//
// ipcMain.on('/12345', (event, arg) => {
//   console.log(arg) // prints "ping"
//   event.reply('/54321', 'pong')
// })

// console.log that your server is up and running
// app.listen(port, () => console.log(`Listening on port ${port}`));
