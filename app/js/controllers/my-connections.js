const {ipcRenderer} = require('electron');
var Color = require('color');
var $ = require('jQuery');

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
};
