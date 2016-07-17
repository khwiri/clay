var $ = require('jQuery');
const Dialog = require('../dialog');

module.exports = (settings) => {
    $('.create-template').click(() => {
        let dialog = new Dialog();
        dialog.show($('.create-template-dialog').clone(), {
            close: () => {
                console.log('on close');
            }
        });
    });
};
