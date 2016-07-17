const {ipcRenderer} = require('electron');
const $ = require('jQuery');

module.exports = (settings) => {

    $('.connect').click(function() {
        console.log('connect');
        let params = {
            host: $('.host').val(),
        };

        let port = $('.port').val();
        if(port)
            params.port = port;

        let ppk = $('.private-key').val();
        if(ppk)
            params.ppk = ppk;

        ipcRenderer.send('connect', params);
    });

    $('.private-key-browse').click(function() {
        ipcRenderer.send('private-key-browse');
        ipcRenderer.once('private-key-path', function(event, data) {
            $('.private-key').val(data.path);
        });
    });
};
