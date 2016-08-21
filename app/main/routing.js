const {ipcMain} = require('electron');
const quickConnect = require('./controllers/quick-connect');
const templates = require('./controllers/templates');
const settings = require('./controllers/settings');
const clay = require('./controllers/clay');

module.exports = (win) => {
    // app
    ipcMain.on('renderer-ready', (event, data) => {clay.ready(win, event, data);});

    // quick connect
    ipcMain.on('connect', quickConnect.connect);
    ipcMain.on('private-key-browse', (event, data) => {quickConnect.privateKeyBrowse(win, event, data);});
    ipcMain.on('save-connection', quickConnect.saveConnection);

    // my connections

    // templates
    ipcMain.on('save-template', templates.save);

    // settings
    ipcMain.on('putty-browse', (event, data) => {settings.puttyBrowse(win, event, data);});
    ipcMain.on('save-settings', settings.save);
};
