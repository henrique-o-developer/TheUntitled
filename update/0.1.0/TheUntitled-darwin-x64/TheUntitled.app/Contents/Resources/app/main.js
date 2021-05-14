var {Tray, app, BrowserWindow, Menu, MenuItem, ipcMain, autoUpdater, dialog } = require("electron");
var reload = false, save = false, cadaster = false, del = false, tel = false
var isDev = require('electron-is-dev');




var menu = Menu.buildFromTemplate([
    {
        label: "geral",
        submenu: [
            {  
                label: "reload",
                accelerator: "CmdOrCtrl+r",
                click: () => {
                    reload = true
                }
            }
        ]
    }
])

Menu.setApplicationMenu(menu)

function createWindow() {
    var appIcon = new Tray(__dirname + "/src/img/tray.png")
    let mainWindow = new BrowserWindow({
        'width': 850,
        'height': 650,
        'min-width': 850,
        'min-height': 650,
        'acceptFirstMouse': true,
        'title': 'Javascript Game!',
        "icon": __dirname + "/src/img/tray.png",
        "webPreferences": {
            "contextIsolation": false, // this is the default in Electron >= 12
            "nodeIntegration": true, // this is the default in Electron >= 5
            "preload": 'preload.js'
        }
    })

    mainWindow.loadFile(__dirname + '/src/index.html')

    
    if (isDev) {
        mainWindow.webContents.openDevTools()
    } else {
        try {
            mainWindow.webContents.openDevTools()
            require('update-electron-app')()
            const server = 'https://https://github.com/fenisosi/TheUntitled'
            const url = `${server}/update/${app.getVersion()}/TheUntitled-${process.platform}-${process.arch}`
        
            autoUpdater.setFeedURL({ url })
        
            autoUpdater.checkForUpdates()
            setInterval(() => {
                autoUpdater.checkForUpdates()
            }, 60000)
        
            autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
                const dialogOpts = {
                    type: 'info',
                    buttons: ['Reiniciar', 'Mais tarde'],
                    title: 'Atualização de Aplicativo',
                    message: processo. latform === 'win32' ? releaseNotes : releaseName,
                    detail: 'Uma nova versão foi baixada. Restarte a aplicação para fazer as alteraçoes, não se esqueça de salvar.'
                }
            
                dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0) autoUpdater.quitAndInstall()
                })
            })
        } catch (err) {
            if (err) console.log(err)
        } 
    }
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})

ipcMain.on('me-da-os-dado-po', (event, arg) => {
    event.sender.send(`reload`, reload)
    event.sender.send(`save`, save)
    event.sender.send(`cadaster`, cadaster)
    event.sender.send(`del`, del)
    event.sender.send(`tel`, tel)
    reload = false
    save = false
    cadaster = false
    del = false
    tel = false
})

ipcMain.on('game-inited', (event, arg) => {
    if (arg) {
        var saved_points = []
        for (var i=0; i<10; i++) {
            var submenu = [];
            if (arg.saved_points[i].name) {
                saved_points.push({
                    label: `point ${arg.saved_points[i].name}`,
                    submenu: submenu
                })
                submenu.push({
                    label: "teleport",
                    accelerator: "Shift+"+i,
                    click: (i) => {
                        tel = i.accelerator.split("+")[1]
                    }
                })
                submenu.push({
                    label: "delete",
                    accelerator: "Shift+Ctrl+"+i,
                    click: (i) => {
                        del = i.accelerator.split("+")[2]
                    }
                })
            } else {
                submenu.push({
                    label: "não cadastrado para cadastrar: Shift+" + i,
                    accelerator: "Shift+"+i,
                    click: (i) => {
                        cadaster = i.accelerator.split("+")[1]
                    }
                    
                })
                saved_points.push({
                    label: `point ${i}`,
                    submenu: submenu
                })
            }
            
        }
        var menu2 = Menu.buildFromTemplate([
            {
                label: "geral",
                submenu: [
                    {  
                        label: "reload",
                        accelerator: "CmdOrCtrl+r",
                        click: () => {
                            reload = true
                        }
                    }
                ]
            },
            {
                label: "game",
                submenu: [
                    {  
                        label: "save",
                        accelerator: "CmdOrCtrl+s",
                        click: () => {
                            save = `save`
                        }
                    },
                    {  
                        label: "exit and save",
                        accelerator: "CmdOrCtrl+Shift+s",
                        click: () => {
                            save = `saveAndReload`
                        }
                    },
                    {
                        label: "saved points",
                        submenu: saved_points
                    }
                ]
            }
        ])
        Menu.setApplicationMenu(menu2)  
    } else {
        Menu.setApplicationMenu(menu)
    }
})

