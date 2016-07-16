const $ = require('jQuery');

function showPage(page, tab) {
    $('body > .content').children(':first').appendTo($('.pages'));
    $(page).appendTo($('body > .content'));
    $('.nav-item').removeClass('selected');
    $(tab).addClass('selected');
}

module.exports = {
    register: (tab, page, show) => {
        tab.click(function() {
            showPage(page, this);
        });

        if(show)
            showPage(page, tab);
    }
};
