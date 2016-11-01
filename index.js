const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;

var window;

ipcMain.on('asynchronous-message', (event, arg) => {
  window.loadURL('file:///' + __dirname + '/index.html');
})


app.on('ready', ()=> {
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false
  });
  window.setMenu(null);
  window.toggleDevTools();

  window.on('closed', () => {
    app.quit();
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  //window.show();

  window.loadURL('file:///' + __dirname + '/index.html');

});
