const {ipcRenderer} = require('electron');
const $ = require('jQuery');
const Dialog = require('../dialog');

let page;

function setInitialPage(settings) {
    $('.id', page).val('');
    $('.name', page).val('');
    $('.template', page).val('');
    $('.host', page).val('');
    $('.port', page).val('');
    setConnectButtons(settings);
}

function bindButtons(settings) {
    $('.footer .connect', page).click(() => {
        let params = {
            host: $('.host', page).val(),
        };

        let port = $('.port', page).val();
        if(port)
            params.port = port;

        let ppk = $('.private-key', page).val();
        if(ppk)
            params.ppk = ppk;

        if(params.host)
            ipcRenderer.send('connect', params);
    });

    $('.footer .cancel', page).click(() => {
        $(document).trigger('my-connections');
        $(document).trigger('on-quick-connect-reset');
    });

    if(!$('.footer .connect', page).length)
        $('.submit-row > *:first-child', page).text(`Editing ${$('.name', page).val()}`);

    $('.footer .save', page).click(() => {
        if(!$('.host', page).val())
            return;

        let dialog = new Dialog();
        dialog.show($('.save-connection', page).clone(), {
            visible: (dialog) => {
                $('.id', dialog).val($('.id', page).val());
                $('.name', dialog).val($('.name', page).val());
                $('.host', dialog).val($('.host', page).val());
                $('.port', dialog).val($('.port', page).val());

                let currentTemplate = $('.template', page).val();
                $(settings.templates).each((index, templateDefinition) => {
                    let template = $('.fresh-template .template').clone();
                    $(template).data('id', templateDefinition.id);
                    $(template).text(templateDefinition.name);
                    $(template).css('background-color', templateDefinition.background);
                    $('.templates', dialog).append(template);

                    if(currentTemplate == templateDefinition.id)
                        $(template).addClass('selected');

                    $(template).click(() => {
                        console.log('template click');
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
                    $(document).trigger('on-connection-saved', settings);
                    $(document).trigger('my-connections');
                    $(document).trigger('on-quick-connect-reset');
                });

                return true;
            }
        });
    });
}

function setConnectButtons(settings) {
    let buttons = $('.submit-row-buttons .connect-buttons', page).clone();
    $('.submit-row', page).removeClass('status');
    $('.submit-row', page).empty().append(buttons.children());
    bindButtons(settings);
}

function setSaveButtons(settings) {
    let buttons = $('.submit-row-buttons .save-buttons', page).clone();
    $('.submit-row', page).addClass('status');
    $('.submit-row', page).empty().append($('<div />'));
    $('.submit-row', page).append(buttons);
    bindButtons(settings);
}

module.exports = (settings) => {
    let currentSettings = settings;
    page = $('.quick-connect-page');

    $(document).on('on-connection-saved', (event, settings) => {
        currentSettings = settings;
    });

    $(document).on('on-quick-connect-reset', (event) => {
        setInitialPage(currentSettings);
    });

    $(page).on('clayOnPageLoad', (event, data) => {
        let port = data.port;
        $('.id', page).val(data.id);
        $('.name', page).val(data.name);
        $('.template', page).val(data.template);
        $('.host', page).val(data.host);
        $('.port', page).val(port && port != '22' ? port : '');
        setSaveButtons(currentSettings);
    });

    $('.private-key-browse', page).click(() => {
        ipcRenderer.send('private-key-browse');
        ipcRenderer.once('private-key-path', function(event, data) {
            $('.private-key').val(data.path);
        });
    });

    setConnectButtons(currentSettings);
};
