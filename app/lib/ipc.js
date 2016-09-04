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
         * Set active status to the toolbar
         */
        ipcMain.on('toolbarStatus', (event, count) => {
            this.windows.manager.toolbarStatus(count);
        });

        /**
         * Open add/edit window
         */
        ipcMain.on('add-edit', (event, data) => {
            this.windows.addedit.show(data);
        });

        /**
         * Open add/edit category
         */
        ipcMain.on('add-edit-category', (event, id) => {
            this.windows.category.show(id);
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

        /**
         * Save Category window data
         */
        ipcMain.on('save-category', (event, body) => {

            this.config.saveCategory(body)
                .then(() => {
                    this.windows.manager.reload(true);
                }, err => {
                    event.sender.send('on-error', err);
                });

        });

        /**
         * Delete URL
         */
        ipcMain.on('delete-url', (event, body) => {

            this.config.deleteUrl(body)
                .then(() => {
                    this.windows.manager.reload();
                }, err => {
                    event.sender.send('on-error', err);
                });

        });

        /**
         * Delete Category
         */
        ipcMain.on('delete-category', (event, body) => {

            this.config.deleteCategory(body)
                .then(() => {
                    this.windows.manager.reload(true);
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
