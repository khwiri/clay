const settings = require('../settings');

function deleteConnections(event, data) {
    let settingsData = settings.get();
    if(settingsData) {
        // This should take the incoming list of connection ids and remove them
        // from the current list.
        settingsData.connections = settingsData.connections.filter((connection) => {
            return !data.includes(connection.id);
        });

        settings.save(settingsData);
        event.sender.send('deleted-connections', settingsData);
    } else
        dialog.showErrorBox('Clay', 'Unable to delete connections because your application data could not be loaded.');
}


module.exports = {
    deleteConnections: (event, data) => {
        deleteConnections(event, data);
    }
};
