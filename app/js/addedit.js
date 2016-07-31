/**
 * Handles Add/Edit Bookmark
 */

const { ipcRenderer } = require('electron'),
	_ = require('lodash'),
	querystring = require('querystring');

let bookmarkId;

$( document ).ready(function() {

	$('input:first').focus();
	loadData();

});

window.onunload = function(){ saveData(); }

/**
 * Parse QS and load data
 */
const loadData = () => {

	const qs = querystring.parse(window.location.search.substring(1));
	if (qs && qs.id){

		bookmarkId = qs.id;
		ipcRenderer.send('data', { _id: bookmarkId });

	}

};

/**
 * Parse form data and close window (on close)
 */
const saveData = () => {

	let title = $('#title').val(),
		url = $('#url').val(),
		category = $('#category').val();

	ipcRenderer.send('save-url', {
		bookmarkId: bookmarkId,
		title: title,
		url: url,
		category: category
	});

};

/**
 * Renders category and binds actions
 */
const render = categories => {

	categories.map(category => {
		$('#category').append(`<option value="${category._id}">${category.title}</option>`);
	});

};

ipcRenderer.on('on-data', (event, data) => {

	categories = data[0];
	urls = data[1];

	render(categories);

	const bookmark = urls.length > 0 ? urls[0] : null;
	if (bookmark){

		$('#title').val(bookmark.title);
		$('#url').val(bookmark.url);
		$('#category').val(bookmark.category_id);

	}

});

ipcRenderer.on('on-error', (event, err) => {
	console.error('err', err);
	alert('There has been a fatal error loading your bookmark, please restart the application and try again.');
});