const {ipcRenderer} = require('electron');
var Color = require('color');
var $ = require('jQuery');
const pages = require('../pages');
const actionBar = require('../actionbar');

let page;

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

function bindConnection(connection, connectionTemplate, template) {
    $(connectionTemplate).click(() => {
        ipcRenderer.send('connect', connection);
    });

    $(connectionTemplate).css('background-color', template.background);

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
    $(edit).click((event) => {
        event.stopPropagation();
        $(document).trigger('quick-connect', connection);
    });
    $(edit).hover((event) => {
        $(event.target).addClass('fa-spin');
        $('.footer .status', page).children(':first').text('Edit connection');
    }, (event) => {
        $(event.target).removeClass('fa-spin');
        $('.footer .status', page).children(':first').text('');
    });

    let clone = $('.clone', connectionTemplate);
    $(clone).click(() => {
        event.stopPropagation();
        delete connection.id;
        ipcRenderer.send('save-connection', connection);
        ipcRenderer.once('saved-connection', (event, settings) => {
            $(document).trigger('on-connection-saved', settings);
        });
    });
    $(clone).hover((event) => {
        $('.footer .status', page).children(':first').text('Clone connection');
    }, (event) => {
        $('.footer .status', page).children(':first').text('');
    });
}

function bindDeleteConnection(connectionTemplate) {
    $(connectionTemplate).click(() => {
        $(connectionTemplate).toggleClass('marked');
    });

    $('.tools', connectionTemplate).hide();
}

function renderConnection(connection, template, action) {
    let connectionTemplate = $('.fresh-connection .connection', page).clone();
    let port = connection.port;
    let host = connection.host + (port && port != '22' ? ':' + port : '');

    $(connectionTemplate).data('id', connection.id);
    $('.name', connectionTemplate).text(connection.name);
    $('.host', connectionTemplate).text(host);

    if(action == 'delete')
        bindDeleteConnection(connectionTemplate);
    else
        bindConnection(connection, connectionTemplate, template);

    $('.connections', page).append(connectionTemplate);
}

function renderConnections(settings, action='normal') {
    $('.connections', page).removeClass('delete').empty();
    if(action == 'delete')
        $('.connections', page).addClass('delete');

    $(settings.connections).each((index, connection) => {
        renderConnection(connection, getTemplate(settings.templates, connection.template), action);
    });
}

function deleteConnections() {
    let connections = [];
    $('.connections .connection.marked', page).each((i, connection) => {
        connections.push($(connection).data('id'));
    });

    ipcRenderer.send('delete-connections', connections);
    ipcRenderer.once('deleted-connections', (event, settings) => {
        $(document).trigger('on-connection-saved', settings);
    });
}

module.exports = (settings) => {
    let currentSettings = settings;
    page = $('.my-connections-page');
    renderConnections(settings);

    $(document).on('on-connection-saved', (event, settings) => {
        currentSettings = settings;
        renderConnections(settings);
    });

    $('.delete', page).click(() => {
        actionBar.showBar(page, '.confirm');
        renderConnections(currentSettings, 'delete');
    });

    $('.actions .confirm', page).click(() => {
        actionBar.hideBar(page);
        deleteConnections();
    });

    $('.actions .cancel', page).click(() => {
        actionBar.hideBar(page);
        renderConnections(currentSettings);
    });
};
