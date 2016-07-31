'use strict';

const electron = require('electron'),
    { BrowserWindow } = electron;

class Manager {

    /**
     * Main URL Manager window
     */
    constructor() {}

    show(id) {

        id = id ? '?id=' + id : '';

        let windowOpts = {
            'show': false,
            'width': 1000,
            'height': 600,
            'accept-first-mouse': true,
            'title-bar-style': 'hidden'
        };

        this._win = new BrowserWindow(windowOpts);

        this._win.loadURL(`file://${__dirname}/manager.html${id}`);

        //this._win.webContents.openDevTools();

        this._win.on('ready-to-show', () => {
            this._win.show();
        });
        this._win.on('closed', () => { this._win = null; });

    }

    reload() {

        this._win.webContents.send('reload');

    }

}

module.exports = Manager;
