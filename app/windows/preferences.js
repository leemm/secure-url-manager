'use strict';

const electron = require('electron'),
    { BrowserWindow } = electron;

class Preferences {

    /**
     * Preferences window
     */
    constructor() {}

    show() {

        let windowOpts = {
            'show': false,
            'width': 600,
            'height': 300,
            'min-width': 500,
            'min-height': 200,
            'accept-first-mouse': true,
            'title-bar-style': 'hidden'
        };

        this._win = new BrowserWindow(windowOpts);

        this._win.loadURL(`file://${__dirname}/manager.html`);

        this._win.on('ready-to-show', () => {
            this._win.show();
        });
        this._win.on('closed', () => { this._win = null; });

    }

}

module.exports = Preferences;
