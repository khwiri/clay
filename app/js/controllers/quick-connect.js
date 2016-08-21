const {ipcRenderer} = require('electron');
const $ = require('jQuery');
const Dialog = require('../dialog');

module.exports = (settings) => {
    $('.connect').click(() => {
        let params = {
            host: $('.quick-connect-page .host').val(),
        };

        let port = $('.port').val();
        if(port)
            params.port = port;

        let ppk = $('.private-key').val();
        if(ppk)
            params.ppk = ppk;

        ipcRenderer.send('connect', params);
    });

    $('.quick-connect-page .save').click(() => {
        let dialog = new Dialog();
        dialog.show($('.save-connection').clone(), {
            visible: (dialog) => {
                $('.host', dialog).val($('.quick-connect-page .host').val());

                $(settings.templates).each((index, templateDefinition) => {
                    let template = $('.fresh-template .template').clone();
                    $(template).data('id', templateDefinition.id);
                    $('.name', template).text(templateDefinition.name);
                    $('.background', template).text(templateDefinition.background).css('background-color', templateDefinition.background);
                    $('.templates', dialog).append(template);

                    $(template).click(() => {
                        $('.templates .template', dialog).removeClass('selected');
                        $(template).addClass('selected');
                    });
                });
            },
            success: (dialog) => {
                let name = $('.connection-name', dialog).val();
                let template = $('.templates .template.selected', dialog).data('id');
                let host = $('.host', dialog).val();

                /*
                console.log(name);
                console.log(template);
                console.log(host);
                */

                ipcRenderer.send('save-connection', {name: name, host: host, template: template});
                ipcRenderer.once('saved-connection', (event, connection) => {
                    alert('Connection Saved!');
                });

                return true;
            }
        });
    });

    $('.private-key-browse').click(() => {
        ipcRenderer.send('private-key-browse');
        ipcRenderer.once('private-key-path', function(event, data) {
            $('.private-key').val(data.path);
        });
    });
};
