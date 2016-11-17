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
                message: "Uhh, we have no idea where to find putty.  If you could take a moment to set your putty path, that'd be great.",
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
