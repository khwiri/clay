const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {execFile} = require('child_process');
const fs = require('fs');
const path = require('path');
const Foobar = require('./js/utils/meh');

let win;

let utils = {
    pathExists: function(directory) {
        try {
            return fs.statSync(directory).isDirectory();
        } catch(error) {}
        return false;
    },

    fileExists: function(file) {
        try {
            return fs.statSync(file).isFile();
        } catch(error) {}
        return false;
    }
}

let settings = {
    getPath: function() {
        return process.env.APPDATA + '/clay/settings.json';
    },

    create: function(settingsPath) {
        settings.save({
            puttyPath: ''
        });
    },

    get: function() {
        let settingsPath = settings.getPath();
        if(!utils.pathExists(path.dirname(settingsPath)))
            fs.mkdirSync(path.dirname(settingsPath));
        if(!utils.fileExists(settingsPath))
            settings.create(settingsPath);
        return JSON.parse(fs.readFileSync(settingsPath));
    },

    save: function(data) {
        let settingsPath = settings.getPath();
        if(utils.pathExists(path.dirname(settingsPath))) {
            fd = fs.openSync(settingsPath, 'w');
            fs.writeFileSync(fd, JSON.stringify(data));
        } else
            dialog.showErrorBox('Clay', "Unable to save settings because they haven't been initialized.");
    }
}

let clay = {
    startup: function(settings) {
        win.webContents.send('startup', settings);
    }
}

ipcMain.on('connect', function(event, data) {
    /*
    let meh = new Foobar();
    console.log(meh.meh);
    */

    let settingsData = settings.get();
    if(settingsData) {
        let puttyPath = settingsData.puttyPath;
        if(puttyPath) {
            var overrides = new Buffer(JSON.stringify({background_color: "0,0,0"})).toString('base64');
            execFile(`${__dirname}/bin/porcelain-1.0/porcelain.exe`, [overrides], (error, stdout, stderr) => {
                if(!error) {
                    data = Object.assign({port: '22'}, data);
                    let params = ['-load', 'sia', data.host, '-P', data.port];
                    if(data.ppk)
                        params = params.concat(['-i', data.ppk]);
                        
                    execFile(puttyPath, params);
                } else
                    dialog.showErrorBox('Clay', 'There was an error while starting putty.');
            });
        } else {
            dialog.showErrorBox('Clay', 'Please set your putty path from the settings tab before trying to connect.');
        }
    } else {
        dialog.showErrorBox('Clay', 'Unable to start a putty session because your application data could not be loaded.');
    }
});

ipcMain.on('private-key-browse', function(event, data) {
    var path = dialog.showOpenDialog(win, {filters: [{name: 'PuTTY Private Key Files', extensions: ['ppk']}], properties: ['openFile']});
    if(path)
        event.sender.send('private-key-path', {path: path[0]});
});

ipcMain.on('putty-browse', function(event, data) {
    var path = dialog.showOpenDialog(win, {filters: [{name: 'Executables', extensions: ['exe']}], properties: ['openFile']});
    if(path)
        event.sender.send('putty-path', {path: path[0]});
});

ipcMain.on('save-settings', function(event, data) {
    settings.save(data);
});

ipcMain.on('renderer-ready', function(event, data) {
    let settingsData = settings.get();
    if(!settingsData.puttyPath) {
        dialog.showMessageBox(win, {
                type: 'warning',
                title: 'Clay',
                message: "Uhh, it doesn't look like you've set your putty path.  Please take a moment so that we know what we're doing.",
                buttons: []
            },
            function() {
                clay.startup(settingsData);
            }
        );
    } else
        clay.startup(settingsData);
});

function createWindow() {
    win = new BrowserWindow({width: 800, height: 600});
    //win.setMenu(null);
    win.loadURL(`file://${__dirname}/index.html`);
    //win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if(win === null)
        createWindow();
})
