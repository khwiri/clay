var $ = require('jQuery');

module.exports = {
    showBar: (page, action) => {
        $('.action-bar', page).children(action).css('display', 'block').addClass('.showing');
        $('.action-bar', page).addClass('show');
    },

    hideBar: (page) => {
        $('.action-bar .showing', page).css('display', 'none');
        $('.action-bar', page).removeClass('show');
    }
};
