'use strict';

const electron = require('electron'),
	path = require('path'),
    { app, nativeImage, Menu, Tray } = electron,
    Config = require('./config.js'),
    IPC = require('./ipc.js');

class Electron {

	constructor(opts) {
		this.options = opts || {};
		this.config = new Config();
		this.ipc = new IPC(this.config);

		this.options.iconPath = path.join(__dirname, '../icons/menu.png');

		return new Promise((resolve, reject) => {

			if ( !this.options.name ){
				reject(new Error('Options not supplied'));
			}else{

				app.setName(this.options.name);

				app.on('ready', () => {
					this._windows();
					this._menu();

					this.ipc.setWindows(this.windows);

					resolve();
				});

				app.on('window-all-closed', () => { return false; });

			}

    	});
	}

	/**
	 * Generate tray menu
	 */
	_menu(){

		let trayIconTemplate = nativeImage.createFromPath(this.options.iconPath);
		trayIconTemplate.setTemplateImage(true);

		let tray = new Tray(trayIconTemplate);
		const contextMenu = Menu.buildFromTemplate([
			{
				label: 'Show URLs',
				click: () => {
					console.log('urls');
					//win.show();
					//win.toggleDevTools();
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Preferences',
				click: () => {
					console.log('prefs');
				},
				//icon: iconPath
			},
			{
				label: 'URL Manager',
				click: () => {
					this.windows.manager.show();
				},
				//icon: iconPath
			},
			{
				label: 'Quit',
				accelerator: 'Command+Q',
				selector: 'terminate:',
			}
		]);
		tray.setToolTip(this.options.name);
		tray.setContextMenu(contextMenu);

	}

	_windows(){

		this.windows = new (require('../windows'))();

	}

}

module.exports = Electron;