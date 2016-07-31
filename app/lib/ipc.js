'use strict';

const electron = require('electron'),
    { ipcMain } = electron;

class IPC {
	constructor(config) {
        this.config = config;

        /**
         * Categories/URLs
         */
        ipcMain.on('data', (event, filter) => {

            Promise.all([
                this.config.categories(),
                this.config.urls(filter)
            ]).then(data  => {
                event.sender.send('on-data', data);
            }, err => {
                event.sender.send('on-error', err);
            });

        });

        /**
         * Open add/edit window
         */
        ipcMain.on('add-edit', (event, id) => {
            this.windows.addedit.show(id);
        });

        /**
         * Save URL window data
         */
        ipcMain.on('save-url', (event, body) => {

            this.config.saveUrl(body)
                .then(() => {
                    this.windows.manager.reload();
                }, err => {
                    event.sender.send('on-error', err);
                });

        });
    }

    setWindows(windows) {
        this.windows = windows;
    }
}

module.exports = IPC;
