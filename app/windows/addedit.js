'use strict';

const electron = require('electron'),
    { BrowserWindow } = electron,
    querystring = require('querystring');

class AddEdit {

    /**
     * Main URL Manager window
     */
    constructor() {}

    show(qs) {

        qs = qs ? '?' + querystring.stringify(qs) : '';

        let windowOpts = {
            'show': false,
            'width': 500,
            'height': 280,
            'accept-first-mouse': true,
            'title-bar-style': 'hidden'
        };

        this._win = new BrowserWindow(windowOpts);

        this._win.loadURL(`file://${__dirname}/addedit.html${qs}`);

        this._win.on('ready-to-show', () => {
            this._win.show();
        });
        this._win.on('closed', () => { this._win = null; });

    }

}

module.exports = AddEdit;
