const {execFile} = require('child_process');
const path = require('path');
const fs = require('fs');
const utils = require('./utils');
// const settings = require('./settings');

module.exports = {
    getPath: () => {
        return process.env.APPDATA + '/clay/settings.json';
    },

    create: (settingsPath) => {
        module.exports.save({
            puttyPath: '',
            connections: [],
            templates: [
                {id: 1, name: 'Dev', background: '#222'},
                {id: 2, name: 'Prod', background: '#b10000'},
                {id: 3, name: 'QA', background: '#31bc34'},
            ]
        });
    },

    get: () => {
        let settingsPath = module.exports.getPath();
        if(!utils.pathExists(path.dirname(settingsPath)))
            fs.mkdirSync(path.dirname(settingsPath));
        if(!utils.fileExists(settingsPath))
            module.exports.create(settingsPath);
        return JSON.parse(fs.readFileSync(settingsPath));
    },

    save: (data) => {
        let settingsPath = module.exports.getPath();
        if(utils.pathExists(path.dirname(settingsPath))) {
            fd = fs.openSync(settingsPath, 'w');
            fs.writeFileSync(fd, JSON.stringify(data));
        } else
            dialog.showErrorBox('Clay', "Unable to save settings because they haven't been initialized.");
    }
};
