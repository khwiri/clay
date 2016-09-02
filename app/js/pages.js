const fs = require('fs');
const $ = require('jQuery');

function showPage(page, tab) {
    $('body > .content').children(':first').detach().appendTo($('.pages'));
    $(page).detach().appendTo($('body > .content'));
    $('.nav-item').removeClass('selected');
    $(tab).addClass('selected');
}

function register(title, page, show) {
    let tab = $('<li />', {text: title, class: 'nav-item'});
    $('.nav.nav-tabs').append(tab);

    let html = fs.readFileSync(page, 'utf-8');
    let parsedHtml = $('<div />').html(html).children(':first').addClass('page');
    $('.pages').append(parsedHtml);

    $(document).on(title.toLowerCase().replace(/ /g, '-'), (event, data) => {
        showPage(parsedHtml, tab);
        console.log($(parsedHtml).first());
        $(parsedHtml).children(':first').trigger('clayOnPageLoad', data);
    });
    $(tab).click(() => {
        showPage(parsedHtml, tab);
    });

    if(show)
        showPage(parsedHtml, tab);
}

module.exports = {
    register: (title, page, show) => {
        register(title, page, show);
    }
};
