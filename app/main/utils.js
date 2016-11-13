const {dialog} = require('electron');
const {execFile} = require('child_process');
const fs = require('fs');
const Color = require('color');

module.exports = {
    connect: (event, data) => {
        // why can't this be imported at the top???
        const settings = require('./settings');

        let settingsData = settings.get();
        if(settingsData) {
            let puttyPath = settingsData.puttyPath;
            if(puttyPath) {
                let backgroundColor = Color('#000');

                if(data.template) {
                    let template = settingsData.templates.find((template) => {
                        return template.id == data.template;
                    });
                    if(template)
                        backgroundColor = Color(template.background);
                }

                let backgroundRgb = backgroundColor.rgb();
                let textRgb = Color('#fff').rgb();
                if(backgroundColor.light())
                    textRgb = Color('#000').rgb();

                var overrides = new Buffer(JSON.stringify({
                    background_color: `${backgroundRgb.r},${backgroundRgb.g},${backgroundRgb.b}`,
                    text_color: `${textRgb.r},${textRgb.g},${textRgb.b}`
                })).toString('base64');

                execFile('./app/bin/porcelain/porcelain.exe', [overrides], (error, stdout, stderr) => {
                    if(!error) {
                        data = Object.assign({port: '22'}, data);
                        let params = ['-load', 'clay-default', data.host, '-P', data.port];
                        if(data.ppk)
                            params = params.concat(['-i', data.ppk]);

                            execFile(puttyPath, params);
                    } else
                        dialog.showErrorBox('Clay', 'There was an error while starting putty.');
                });
            } else
                dialog.showErrorBox('Clay', 'Please set your putty path from the settings tab before trying to connect.');
        } else
            dialog.showErrorBox('Clay', 'Unable to start a putty session because your application data could not be loaded.');
    },

    pathExists: (directory) => {
        try {
            return fs.statSync(directory).isDirectory();
        } catch(error) {}
        return false;
    },

    fileExists: (file) => {
        try {
            return fs.statSync(file).isFile();
        } catch(error) {}
        return false;
    }
};
