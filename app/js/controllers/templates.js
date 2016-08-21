const $ = require('jQuery');
const {ipcRenderer} = require('electron');
const Dialog = require('../dialog');

function renderTemplate(templateDefinition) {
    let template = $('.fresh-template .template').clone();
    $('.name', template).text(templateDefinition.name);
    $('.background', template).text(templateDefinition.background).css('background-color', templateDefinition.background);
    $('.templates-page .templates').append(template);

    $(template).click(() => {
        showTemplateDialog(templateDefinition);
    });
}

function renderTemplates(templates) {
    $('.templates').empty();
    $(templates).each((index, template) => {
        renderTemplate(template);
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
            ipcRenderer.once('saved-templates', function(event, templates) {
                renderTemplates(templates);
            });

            return true;
        }
    });
}

module.exports = (settings) => {
    renderTemplates(settings.templates);

    $('.create-template').click(() => {
        showTemplateDialog();
    });
};
