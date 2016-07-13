const {dialog} = require('electron');
const settings = require('../settings');

function startup(win, settings) {
    win.webContents.send('startup', settings);
}

function ready(win, event, data) {
    let settingsData = settings.get();
    if(!settingsData.puttyPath) {
        dialog.showMessageBox(win, {
                type: 'warning',
                title: 'Clay',
                message: "Uhh, it doesn't look like you've set your putty path.  Please take a moment so that we know what we're doing.",
                buttons: []
            },
            function() {
                startup(win, settingsData);
            }
        );
    } else
        startup(win, settingsData);
}


module.exports = {
    ready: (win, event, data) => {
        ready(win, event, data);
    }
};