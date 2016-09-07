const {ipcRenderer} = require('electron');
var Color = require('color');
var $ = require('jQuery');
const pages = require('../pages');
const actionBar = require('../actionbar');

function getTemplate(templates, id) {
    let found = {background: '#000'};
    $(templates).each((index, template) => {
        if(template.id == id) {
            found = template;
            return false;
        }
    });

    return found;
}

function renderConnection(connection, template) {
    let connectionTemplate = $('.fresh-connection .connection').clone();
    let port = connection.port;
    let host = connection.host + (port && port != '22' ? ':' + port : '');

    $(connectionTemplate).css('background-color', template.background);
    $('.name', connectionTemplate).text(connection.name);
    $('.host', connectionTemplate).text(host);

    let background = Color(template.background);
    let lightBackground = background.lighten(0.15).hexString();
    if(background.dark())
        $(connectionTemplate).addClass('dark');
    $(connectionTemplate).hover(() => {
        $(connectionTemplate).css('background-color', lightBackground);
    }, () => {
        $(connectionTemplate).css('background-color', template.background);
    });

    let tip = $('.tip', connectionTemplate);
    let edit = $('.edit', connectionTemplate);
    $(edit).click(() => {
        $(document).trigger('quick-connect', connection);
    });
    $(edit).hover((event) => {
        $(event.target).addClass('fa-spin');
        $(tip).text('edit');
    }, (event) => {
        $(event.target).removeClass('fa-spin');
        $(tip).text('');
    });

    let clone = $('.clone', connectionTemplate);
    $(clone).click(() => {
        delete connection.id;
        ipcRenderer.send('save-connection', connection);
        ipcRenderer.once('saved-connection', (event, settings) => {
            $(document).trigger('on-connection-saved', settings);
        });
    });
    $(clone).hover((event) => {
        $(tip).text('clone');
    }, (event) => {
        $(tip).text('');
    });

    $('.my-connections-page .connections').append(connectionTemplate);
}

function renderConnections(settings) {
    $('.my-connections-page .connections').empty();
    $(settings.connections).each((index, connection) => {
        renderConnection(connection, getTemplate(settings.templates, connection.template));
    });
}

module.exports = (settings) => {
    $(document).on('on-connection-saved', (event, settings) => { renderConnections(settings); });
    renderConnections(settings);

    $('.my-connections-page .delete').click(() => {
        actionBar.showBar('.my-connections-page', '.confirm');
    });

    $('.my-connections-page .confirm').click(() => {
        actionBar.hideBar('.my-connections-page');
    });
};
