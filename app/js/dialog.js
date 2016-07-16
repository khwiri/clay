const $ = require('jQuery');

class Dialog {
    constructor(options) {
        this.dialog = $('.dialog').clone();
        this.options = $.extend({
            show: true,
            animation_speed: 150,
            starting_top: 10,
            final_top: 20
        }, options ? options : {});
    }

    show(dialogContent, options) {
        if(!$('.glass').length)
            $('body').append($('<div />', {class: 'glass'}));
        let glass = $('.glass').fadeIn({duration: this.options.animation_speed, complete: () => {
            $('.header .title', this.dialog).text($('.title', dialogContent).text());
            $('.body', this.dialog).append($('.content', dialogContent).children());
            $('.footer', this.dialog).append($('.footer', dialogContent).children());
            $(this.dialog).click((event) => {event.stopPropagation();});
            $('.glass').append(this.dialog.addClass('active').fadeIn(this.options.animation_speed).animate({top: this.options.final_top}, this.options.animation_speed).dequeue());
            let close = () => {
                if(this.options.close ? this.options.close($(this).data('intent')) : true)
                    this.hide();
            }
            $('.footer > button', this.dialog).click(close);
            $('.header .close', this.dialog).click(close);
            $(glass).click(close);
        }});
    }

    hide() {
        let dialog = $('.dialog.active').fadeOut({duration: this.options.animation_speed, complete: () => {
            $(dialog).remove();
            let glass = $('.glass').fadeOut({duration: this.options.animation_speed, complete: () => {
                $(glass).unbind('click');
            }});
        }}).animate({top: this.options.starting_top}, this.options.animation_speed).dequeue();
    }
}

module.exports = Dialog;
