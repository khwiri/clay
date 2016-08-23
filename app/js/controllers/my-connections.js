const {ipcRenderer} = require('electron');
var $ = require('jQuery');

function renderConnection(connection) {
    $('.my-connections-page .connections').append($('<div />', {text: connection.name}));
}

function renderConnections(connections) {
    $('.my-connections-page .connections').empty();
    $(connections).each((index, connection) => {
        renderConnection(connection);
    });
}

module.exports = (settings) => {
    $(document).on('on-connection-saved', (event, data) => { renderConnections(data.connections); });
    renderConnections(settings.connections);
};
