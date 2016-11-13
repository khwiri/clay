const settings = require('../settings');

function save(event, data) {
    let settingsData = settings.get();
    if(settingsData) {
        let append = true;
        settingsData.templates.forEach((template, i) => {
            if(data.id == template.id) {
                settingsData.templates[i].name = data.name;
                settingsData.templates[i].background = data.backgroundColor;
                append = false;
            }
        });

        if(append) {
            settingsData.templates.push({
                id: (new Date).getTime(),
                name: data.name,
                background: data.backgroundColor
            });
        }

        settings.save(settingsData);
        event.sender.send('saved-templates', settingsData);
    }
}

function deleteTemplates(event, data) {
    let settingsData = settings.get();
    if(settingsData) {
        // This should take the incoming list of template ids and remove them
        // from the current list.
        settingsData.templates = settingsData.templates.filter((template) => {
            return !data.includes(template.id);
        });

        settings.save(settingsData);
        event.sender.send('deleted-templates', settingsData);
    } else
        dialog.showErrorBox('Clay', 'Unable to delete templates because your application data could not be loaded.');
}

module.exports = {
    save: (event, data) => {
        save(event, data);
    },

    deleteTemplates: (event, data) => {
        deleteTemplates(event, data);
    }
}
