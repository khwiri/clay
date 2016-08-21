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
        event.sender.send('saved-templates', settingsData.templates);
    }
}

module.exports = {
    save: (event, data) => {
        save(event, data);
    }
}
