const {ipcRenderer} = require('electron');
var $ = require('jQuery');

module.exports = (settings) => {    
    if(settings.puttyPath)
        $('.putty-path').val(settings.puttyPath);

    $('.save').click(function() {
        ipcRenderer.send('save-settings', {
            puttyPath: $('.putty-path').val()
        });
    });

    $('.putty-browse').click(function() {
        ipcRenderer.send('putty-browse');
        ipcRenderer.once('putty-path', function(event, data) {
            $('.putty-path').val(data.path);
        });
    });
};
