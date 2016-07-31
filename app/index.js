/**
 * URL Manager for Mac OSX via Menubar
 * by Lee M <leemmccormick@gmail.com> (https://github.com/leemm/) 2016
 */

const pkg = require('./package.json'),
	electron = require('./lib/electron.js');

new electron({
		name: pkg.productName,
		version: pkg.version
	})
	.then( data => {
		console.log('im ready!');
	})
	.catch( err => {
		console.error(err.toString());
	});