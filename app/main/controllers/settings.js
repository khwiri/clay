const {dialog} = require('electron');
const settings = require('../settings');

function puttyBrowse(win, event, data) {
    var path = dialog.showOpenDialog(win, {filters: [{name: 'Executables', extensions: ['exe']}], properties: ['openFile']});
    if(path)
        event.sender.send('putty-path', {path: path[0]});
};

function save(event, data) {
    let settingsData = settings.get();
    if(settingsData) {
        settingsData.puttyPath = data.puttyPath;
        settings.save(settingsData);
    } else
        dialog.showErrorBox('Clay', 'Unable to save settings because your application data could not be loaded.');
};

module.exports = {
    puttyBrowse: (win, event, data) => {
        puttyBrowse(win, event, data);
    },

    save: (event, data) => {
        save(event, data);
    }
};
