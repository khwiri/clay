const {app, BrowserWindow} = require('electron');

let win;

function createWindow() {
    win = new BrowserWindow({width: 850, height: 600});
    //win.setMenu(null);
    win.loadURL(`file://${__dirname}/../views/index.html`);
    //win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });

    require('./routing')(win);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if(win === null)
        createWindow();
})
