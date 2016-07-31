'use strict';

const fs = require('fs-extra'),
	path = require('path'),
    os = require('os'),
    Datastore = require('nedb'),
    applicationSupport = path.join(os.homedir(), 'Library/Application Support/Secure URL Manager');

fs.ensureDirSync(applicationSupport);

this.category = new Datastore({ filename: path.join(applicationSupport, 'category'), autoload: true });
this.url = new Datastore({ filename: path.join(applicationSupport, 'url'), autoload: true });

// this.category.insert([
//     {
//         title: 'Category 1',
//         date_added: new Date()
//     },
//     {
//         title: 'Category 2',
//         date_added: new Date()
//     }
// ], function (err, newDoc) {
//     console.log('newDoc', newDoc);
// });

this.url.insert([
    {
        category_id: 'FvqwLJDSsib5erJP',
        title: 'Google',
        url: 'http://www.google.com/',
        clicked: 0,
        date_added: new Date()
    },
    {
        category_id: 'FvqwLJDSsib5erJP',
        title: 'Facebook homepage',
        url: 'http://www.google.com/',
        clicked: 0,
        date_added: new Date()
    },
    {
        category_id: 'QtrVF02PQQLDtpv3',
        title: 'BBC News',
        url: 'http://news.bbc.co.uk/',
        clicked: 0,
        date_added: new Date()
    },
    {
        category_id: 'FvqwLJDSsib5erJP',
        title: 'Cheese',
        url: 'http://www.cheese.com/',
        clicked: 0,
        date_added: new Date()
    },
    {
        category_id: 'FvqwLJDSsib5erJP',
        title: 'Bananas',
        url: 'http://www.bananas.com/index.html',
        clicked: 0,
        date_added: new Date()
    },
    {
        category_id: 'QtrVF02PQQLDtpv3',
        title: 'Fish',
        url: 'http://www.fish.com/index.html',
        clicked: 0,
        date_added: new Date()
    },
    {
        category_id: 'FvqwLJDSsib5erJP',
        title: 'Cake',
        url: 'http://www.cakes.com/',
        clicked: 0,
        date_added: new Date()
    },
    {
        category_id: 'FvqwLJDSsib5erJP',
        title: 'Wikipedia',
        url: 'http://www.wikipedia.org/',
        clicked: 0,
        date_added: new Date()
    }
], function (err, newDoc) {
    console.log('newDoc', newDoc);
});
