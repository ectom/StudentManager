const { ipcMain } = require('electron')

require('./server/config/routes')(ipcMain);
