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
     * Query data for URLs
     * @param  {Object} filter
     * @return {Promise}
     */
    urls(filter) {

        if (!filter){ filter = {}; }

        if ( Object.keys(filter).length > 0 ){
            let newFilter = {};
            newFilter['$or'] = [];

            for (let prop in filter){

                let newProp = {};
                newProp[prop] = new RegExp(filter[prop], 'gi');

                newFilter['$or'].push(newProp);
            }

            filter = newFilter;
        }

        return new Promise((resolve, reject) => {

            this.url.find(filter, function (err, docs) {
                if (err){ reject(new Error(err.toString())); return; }

                resolve(docs);
            });

        });

    }

    /**
     * Save Category to database
     * @param  {Object} form body
     * @return {Promise}
     */
    saveCategory(body) {

        return new Promise((resolve, reject) => {

            if (body.categoryId){ // Update

                this.category.update({ _id: body.categoryId }, { $set: { title: body.title } }, {}, err => {
                    if (err){ reject(new Error(err.toString())); return; }

                    resolve();
                });

            } else { // Insert

                this.category.insert({ title: body.title }, err => {
                    if (err){ reject(new Error(err.toString())); return; }

                    resolve();
                });

            }


        });

    }

    /**
     * Save URL to database
     * @param  {Object} form body
     * @return {Promise}
     */
    saveUrl(body) {

        return new Promise((resolve, reject) => {

            if (body.bookmarkId){ // Update

                this.url.update({ _id: body.bookmarkId }, { $set: { title: body.title, url: body.url, category_id: body.category } }, {}, err => {
                    if (err){ reject(new Error(err.toString())); return; }

                    resolve();
                });

            } else { // Insert

                this.url.insert({ title: body.title, url: body.url, category_id: body.category }, err => {
                    if (err){ reject(new Error(err.toString())); return; }

                    resolve();
                });

            }

        });

    }

    /**
     * Delete Category from database
     * @param  {Object} form body
     * @return {Promise}
     */
    deleteCategory(body) {

        return new Promise((resolve, reject) => {

            this.category.remove({ _id: body.categoryId }, {}, err => {
                if (err){ reject(new Error(err.toString())); return; }

                resolve();
            });

        });

    }

    /**
     * Delete URL from database
     * @param  {Object} form body
     * @return {Promise}
     */
    deleteUrl(body) {

        return new Promise((resolve, reject) => {

            let options = Array.isArray(body) ? { multi: true } : {};
            body = Array.isArray(body) ? { _id : { $in : body } } : body;

            this.url.remove(body, options, err => {
                if (err){ reject(new Error(err.toString())); return; }

                resolve();
            });

        });

    }

}

module.exports = Config;
