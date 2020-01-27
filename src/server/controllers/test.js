const ipc = require('electron').ipcMain

module.exports = {
  test: function (req, res) {
    console.log('hello from backend')
    req.reply('/backend_reply', { express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
  },
  ipc: function (event, arg) {
    console.log(arg)
    return {data: 'Pong, connected to backend IPC'}
    // event.reply('/54321', {data: 'pong'})
  }
};