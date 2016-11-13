const {ipcMain} = require('electron');
const quickConnect = require('./controllers/quick-connect');
const myConnections = require('./controllers/my-connections');
const templates = require('./controllers/templates');
const settings = require('./controllers/settings');
const clay = require('./controllers/clay');
const utils = require('./utils');

module.exports = (win) => {
    // app
    ipcMain.on('renderer-ready', (event, data) => {clay.ready(win, event, data);});
    ipcMain.on('connect', utils.connect);

    // quick connect
    ipcMain.on('private-key-browse', (event, data) => {quickConnect.privateKeyBrowse(win, event, data);});
    ipcMain.on('save-connection', quickConnect.saveConnection);

    // my connections
    ipcMain.on('delete-connections', myConnections.deleteConnections);

    // templates
    ipcMain.on('save-template', templates.save);
    ipcMain.on('delete-templates', templates.deleteTemplates);

    // settings
    ipcMain.on('putty-browse', (event, data) => {settings.puttyBrowse(win, event, data);});
    ipcMain.on('save-settings', settings.save);
};
