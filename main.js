const { app, BrowserWindow, Menu } = require('electron');
const pdfviewer = require("electron-pdf-viewer");
const path =  require('path');

Menu.setApplicationMenu(false);

let win = null;

const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon:"./assets/files/The_Simpsons_promo.png",
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    win.webContents.openDevTools()
    win.loadFile('./assets/pages/index.html');

    const splash = new BrowserWindow({
        width: 310,
        height: 400,
        transparent: true, 
        frame: false, 
        alwaysOnTop: true,
        center:true
    })

    splash.loadFile('./assets/pages/splash.html');

    win.once('ready-to-show', () => {
        setTimeout(function(){ 
            splash.close();
            win.show();
        }, 3000);
    })
}

app.whenReady().then(() => {
    createWindow();
  
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
})

let viewerPDF = (file) => {
    let pdf = pdfviewer.showpdf(file,{
        width: 600,
        height: 450,
        modal: true,
        parent: win
    })
    pdf.show();
}

let openWin = (end) => {
    winNew = new BrowserWindow({
        width: 400,
        height: 300,
        modal: true,
        parent: win,
        icon:"./assets/files/The_Simpsons_promo.png",
        webPreferences:{
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    winNew.webContents.openDevTools()
    winNew.loadFile(end);
}

const ipcMain = require('electron').ipcMain;

ipcMain.on('open-pdf', (event, data) => {
    viewerPDF(data.end);
});

ipcMain.on('open-win', (event, end) => {
    console.log(end)
    openWin(end.end);
});

ipcMain.on('message-channel', (event, data) => {
  console.log(data.key1);
  event.reply('return',data.key2);
});