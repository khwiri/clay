const {ipcRenderer} = require('electron');
const $ = require('jQuery');
const Dialog = require('../dialog');

module.exports = (settings) => {
    let currentSettings = settings;

    $(document).on('on-connection-saved', (event, settings) => {
        currentSettings = settings;
    });

    $('.quick-connect-page').on('clayOnPageLoad', (event, data) => {
        let port = data.port;
        $('.quick-connect-page .id').val(data.id);
        $('.quick-connect-page .name').val(data.name);
        $('.quick-connect-page .template').val(data.template);
        $('.quick-connect-page .host').val(data.host);
        $('.quick-connect-page .port').val(port && port != '22' ? port : '');
    });

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

        if(params.host)
            ipcRenderer.send('connect', params);
    });

    $('.quick-connect-page .save').click(() => {
        if(!$('.quick-connect-page .host').val())
            return;

        let dialog = new Dialog();
        dialog.show($('.save-connection').clone(), {
            visible: (dialog) => {
                $('.id', dialog).val($('.quick-connect-page .id').val());
                $('.name', dialog).val($('.quick-connect-page .name').val());
                $('.host', dialog).val($('.quick-connect-page .host').val());
                $('.port', dialog).val($('.quick-connect-page .port').val());

                let currentTemplate = $('.quick-connect-page .template').val();
                $(currentSettings.templates).each((index, templateDefinition) => {
                    let template = $('.fresh-template .template').clone();
                    $(template).data('id', templateDefinition.id);
                    $(template).text(templateDefinition.name);
                    $(template).css('background-color', templateDefinition.background);
                    $('.templates', dialog).append(template);

                    if(currentTemplate == templateDefinition.id)
                        $(template).addClass('selected');

                    $(template).click(() => {
                        $('.templates .template', dialog).removeClass('selected');
                        $(template).addClass('selected');
                    });
                });
            },
            success: (dialog) => {
                let id = $('.id', dialog).val();
                let name = $('.name', dialog).val();
                let host = $('.host', dialog).val();
                let port = $('.port', dialog).val();
                let template = $('.templates .template.selected', dialog).data('id');

                // only save when a template and name have been provided
                if(!name || !template)
                    return false;

                let newConnection = {id: id, name: name, host: host, template: template, port: port};
                ipcRenderer.send('save-connection', newConnection);
                ipcRenderer.once('saved-connection', (event, settings) => {
                    // alert('Connection Saved!');
                    $(document).trigger('on-connection-saved', settings);
                    $(document).trigger('my-connections');
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
