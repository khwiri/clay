const {execFile} = require('child_process');
const path = require('path');
const fs = require('fs');
const utils = require('./utils');

module.exports = {
    getPath: () => {
        return process.env.APPDATA + '/clay/settings.json';
    },
    
    create: (settingsPath) => {
        settings.save({
            puttyPath: ''
        });
    },
    
    get: () => {
        let settingsPath = module.exports.getPath();
        if(!utils.pathExists(path.dirname(settingsPath)))
            fs.mkdirSync(path.dirname(settingsPath));
        if(!utils.fileExists(settingsPath))
            settings.create(settingsPath);
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