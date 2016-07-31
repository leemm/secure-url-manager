'use strict';

const fs = require('fs-extra'),
	path = require('path'),
    os = require('os'),
    Datastore = require('nedb'),
    applicationSupport = path.join(os.homedir(), 'Library/Application Support/Secure URL Manager');

class Config {
	constructor() {

        fs.ensureDirSync(applicationSupport);

        this.category = new Datastore({ filename: path.join(applicationSupport, 'category'), autoload: true });
        this.url = new Datastore({ filename: path.join(applicationSupport, 'url'), autoload: true });

    }

    /**
     * Query data for URLs
     * @param  {Object} filter
     * @return {Promise}
     */
    urls(filter) {

        if (!filter){ filter = {}; }

        return new Promise((resolve, reject) => {

            this.url.find(filter, function (err, docs) {
                if (err){ reject(new Error(err.toString())); return; }

                resolve(docs);
            });

        });

    }

    /**
     * Query data for Categories
     * @param  {Object} filter
     * @return {Promise}
     */
    categories(filter) {

        if (!filter){ filter = {}; }

        return new Promise((resolve, reject) => {

            this.category.find(filter, function (err, docs) {
                if (err){ reject(new Error(err.toString())); return; }

                resolve(docs);
            });

        });

    }

    /**
     * Save URL to database
     * @param  {Object} form body
     * @return {Promise}
     */
    saveUrl(body) {

        return new Promise((resolve, reject) => {

            this.url.update({ _id: body.bookmarkId }, { $set: { title: body.title, url: body.url, category_id: body.category } }, {}, err => {
                if (err){ reject(new Error(err.toString())); return; }

                resolve();
            });

        });

    }
}

module.exports = Config;
