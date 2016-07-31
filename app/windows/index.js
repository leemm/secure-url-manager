'use strict';

const _ = require('lodash'),
    fs = require('fs-extra'),
	path = require('path');

class Windows {

    /**
     * Parse all windows
     * @return {Object}
     */
    constructor() {
        let windows = {};

        _.filter(fs.readdirSync(__dirname), file => { return file.substring(0, 1) !== '.' && file.indexOf('.js') > -1 && file !== 'index.js'; }).map(file => {
            let parts = path.parse(file);

            windows[parts.name] = new (require(path.join(__dirname, file)))();
        });

        return windows;
    }

}

module.exports = Windows;
