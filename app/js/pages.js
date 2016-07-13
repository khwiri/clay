require('jQuery');

/*
var clay = (function(clay, $) {
    let _pages = {
        show: function(page, tab) {
            $('.content').children(':first').appendTo($('.pages'));
            $(page).appendTo($('.content'));
            $('.nav-item').removeClass('selected');
            $(tab).addClass('selected');
        }
    };

    let pages = {
        register: function(tab, page, show) {
            tab.click(function() {
                _pages.show(page, this);
            });
            
            if(show)
                _pages.show(page, tab);
            },
        };
        
    return $.extend(clay, {pages: pages});
}(window.clay = window.clay || {}, require('jQuery')));
*/

function showPage(page, tab) {
    $('.content').children(':first').appendTo($('.pages'));
    $(page).appendTo($('.content'));
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
