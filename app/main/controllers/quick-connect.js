const {app, BrowserWindow, ipcMain, dialog} = require('electron');
// const {execFile} = require('child_process');
const settings = require('../settings');
const utils = require('../utils');

function saveConnection(event, data) {
    let settingsData = settings.get();
    if(settingsData) {
        if(data.id) {
            settingsData.connections.forEach((connection, i) => {
                if(connection.id == data.id) {
                    connection.name = data.name;
                    connection.host = data.host;
                    connection.port = data.port ? data.port : '22';
                    connection.template = data.template;
                }
            });
        } else {
            data.id = (new Date).getTime();
            settingsData.connections.push(data);
        }

        settings.save(settingsData);
        event.sender.send('saved-connection', settingsData);
    } else
        dialog.showErrorBox('Clay', 'Unable to save connection because your application data could not be loaded.');
}

function privateKeyBrowse(win, event, data) {
    var path = dialog.showOpenDialog(win, {filters: [{name: 'PuTTY Private Key Files', extensions: ['ppk']}], properties: ['openFile']});
    if(path)
        event.sender.send('private-key-path', {path: path[0]});
}

module.exports = {
    saveConnection: (event, data) => {
        saveConnection(event, data);
    },

    privateKeyBrowse: (win, event, data) => {
        privateKeyBrowse(win, event, data);
    }
};
