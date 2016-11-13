const $ = require('jQuery');
const {ipcRenderer} = require('electron');
const Dialog = require('../dialog');
const actionBar = require('../actionbar');

let page;

function bindTemplate(template, templateTemplate) {
    $('.background', templateTemplate).text(template.background).css('background-color', template.background);

    $(templateTemplate).click(() => {
        showTemplateDialog(template);
    });
}

function bindDeleteTemplate(templateTemplate) {
    $(templateTemplate).click(() => {
        $(templateTemplate).toggleClass('marked');
    });
}

function renderTemplate(template, action) {
    let templateTemplate = $('.fresh-template .template', page).clone(); // really...templateTemplate???
    $(templateTemplate).data('id', template.id);
    $('.name', templateTemplate).text(template.name);

    if(action == 'delete')
        bindDeleteTemplate(templateTemplate);
    else
        bindTemplate(template, templateTemplate);

    $('.templates', page).append(templateTemplate);
}

function renderTemplates(settings, action='normal') {
    $('.templates', page).removeClass('delete').empty();
    if(action == 'delete')
        $('.templates', page).addClass('delete');

    $(settings.templates).each((index, template) => {
        renderTemplate(template, action);
    });
}

function deleteTemplates() {
    let templates = [];
    $('.templates .template.marked', page).each((i, template) => {
        templates.push($(template).data('id'));
    });

    ipcRenderer.send('delete-templates', templates);
    ipcRenderer.once('deleted-templates', (event, settings) => {
        $(document).trigger('on-connection-saved', settings);
    });
}

function showTemplateDialog(template) {
    let dialog = new Dialog();
    let dialogContent = $('.create-template-dialog').clone();

    if(template) {
        $('.template-id', dialogContent).val(template.id);
        $('.template-name', dialogContent).val(template.name);
        $('.template-background', dialogContent).val(template.background);
    }

    dialog.show(dialogContent, {
        success: (dialog) => {
            let id = $('.template-id', dialog).val();
            let name = $('.template-name', dialog).val();
            let background = $('.template-background', dialog).val();

            if(!name || !background) {
                alert('Invalid template data');
                return false;
            }

            ipcRenderer.send('save-template', {id: id, name: name, backgroundColor: background});
            ipcRenderer.once('saved-templates', function(event, settings) {
                $(document).trigger('on-connection-saved', settings);
            });

            return true;
        }
    });
}

module.exports = (settings) => {
    let currentSettings = settings;
    page = $('.templates-page');
    renderTemplates(settings);

    $(document).on('on-connection-saved', (event, settings) => {
        currentSettings = settings;
        renderTemplates(settings);
    });

    $('.create', page).click(() => {
        showTemplateDialog();
    });

    $('.delete', page).click(() => {
        actionBar.showBar(page, '.confirm');
        renderTemplates(currentSettings, 'delete');
    });

    $('.actions .confirm', page).click(() => {
        actionBar.hideBar(page);
        deleteTemplates();
    });

    $('.actions .cancel', page).click(() => {
        actionBar.hideBar(page);
        renderTemplates(currentSettings);
    });
};
