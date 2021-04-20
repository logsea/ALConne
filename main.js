const electron = require('electron')
const { BrowserWindow, app } = require('electron')
const path = require('path')

app.allowRendererProcessReuse = false

/*
Load Python Process
*/
const _Python_Src = 'gamecode'
const _Python_Des = 'gamecore'
const _Python_Main_And_Message = 'api'

let _Python_Proc = null
let _Python_Port = null

const pythonPackaged = () =>{
    const fullPath = path.join(__dirname, _Python_Des)
    return require('fs').existsSync(fullPath)
}

const getScriptPath = () => {
    if (!pythonPackaged()) {
        return path.join(__dirname, _Python_Src, _Python_Main_And_Message + '.py')
    }
    if (process.platform === 'win32') {
        return path.join(__dirname, _Python_Des, _Python_Module, _Python_Module + '.exe')
    }
    return path.join(__dirname, _Python_Des, _Python_Module, _Python_Module)
}

const selectPort = () => {
    _Python_Port = 4242
    return _Python_Port
}

const createPyProc = () => {
    let script = getScriptPath()
    let port = '' + selectPort()
  
    if (pythonPackaged()) {
        _Python_Proc = require('child_process').execFile(script, [port]);
    } else {
        console.log(script);
        _Python_Proc = require('child_process').spawn('python', [ "-u" , script, port], {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit"
          });
    }
   
    if (_Python_Proc != null) {
        console.log('child process success on port ' + port)
    }
}


const exitPyProc = () => {
    _Python_Proc.kill()
    _Python_Proc = null
    _Python_Port = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)


/*
Start Main Process
*/
function createWindow() {
    let win = new BrowserWindow({
        width: 1000,
        height: 800,
        resizable:false,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('mainpage.html')
    win.webContents.openDevTools()
    win.on('closed', () => {
        win = null
    })
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

electron.ipcMain.on('close-app', (event, arg)=>{
    console.log("app quit get");
    app.quit();
})

// console.log(app.allowRendererProcessReuse);