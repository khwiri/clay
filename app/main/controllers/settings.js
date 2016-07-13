const {dialog} = require('electron');
const settings = require('../settings');

function puttyBrowse(win, event, data) {
    var path = dialog.showOpenDialog(win, {filters: [{name: 'Executables', extensions: ['exe']}], properties: ['openFile']});
    if(path)
        event.sender.send('putty-path', {path: path[0]});
};

function save(event, data) {
    settings.save(data);
};

module.exports = {
    puttyBrowse: (win, event, data) => {
        puttyBrowse(win, event, data);
    },
    
    save: (event, data) => {
        save(event, data);
    }
};
    