'use strict';

const electron = require('electron'),
    { BrowserWindow } = electron;

class AddEdit {

    /**
     * Main URL Manager window
     */
    constructor() {}

    show(id) {

        id = id ? '?id=' + id : '';

        let windowOpts = {
            'show': false,
            'width': 500,
            'height': 280,
            'accept-first-mouse': true,
            'title-bar-style': 'hidden'
        };

        this._win = new BrowserWindow(windowOpts);

        this._win.loadURL(`file://${__dirname}/addedit.html${id}`);

        this._win.on('ready-to-show', () => {
            this._win.show();
        });
        this._win.on('closed', () => { this._win = null; });

    }

}

module.exports = AddEdit;
