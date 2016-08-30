const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {execFile} = require('child_process');
const settings = require('../settings');

function connect(event, data) {
    let settingsData = settings.get();
    if(settingsData) {
        let puttyPath = settingsData.puttyPath;
        if(puttyPath) {
            var overrides = new Buffer(JSON.stringify({background_color: "0,255,0"})).toString('base64');
            execFile('./app/bin/porcelain-1.0/porcelain.exe', [overrides], (error, stdout, stderr) => {
                if(!error) {
                    data = Object.assign({port: '22'}, data);
                    let params = ['-load', 'sia', data.host, '-P', data.port];
                    if(data.ppk)
                        params = params.concat(['-i', data.ppk]);

                        execFile(puttyPath, params);
                } else
                    dialog.showErrorBox('Clay', 'There was an error while starting putty.');
            });
        } else
            dialog.showErrorBox('Clay', 'Please set your putty path from the settings tab before trying to connect.');
    } else
        dialog.showErrorBox('Clay', 'Unable to start a putty session because your application data could not be loaded.');
}

function saveConnection(event, data) {
    let settingsData = settings.get();
    if(settingsData) {
        if(data.id) {
            settingsData.connections.forEach((connection, i) => {
                if(connection.id == data.id) {
                    connection.name = data.name;
                    connection.host = data.host;
                    connection.port = data.port;
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
    connect: (event, data) => {
        connect(event, data);
    },

    saveConnection: (event, data) => {
        saveConnection(event, data);
    },

    privateKeyBrowse: (win, event, data) => {
        privateKeyBrowse(win, event, data);
    }
};
