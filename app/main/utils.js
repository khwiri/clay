const fs = require('fs');

module.exports = {
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