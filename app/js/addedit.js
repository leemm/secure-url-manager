/**
 * Handles Add/Edit Bookmark
 */

const { ipcRenderer } = require('electron'),
	_ = require('lodash'),
	querystring = require('querystring');

let bookmarkId, categoryId;

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

	categoryId = qs && qs.category ? qs.category : null;

	if (qs && qs.id){

		bookmarkId = qs.id;
		ipcRenderer.send('data', { _id: bookmarkId });

	} else {

		bookmarkId = null;
		ipcRenderer.send('data');

	}

};

/**
 * Parse form data and close window (on close)
 */
const saveData = () => {

	let title = $('#title').val(),
		url = $('#url').val(),
		category = $('#category').val(),
		body = {
			title: title,
			url: url,
			category: category
		};

	if (bookmarkId){ body.bookmarkId = bookmarkId; }

	ipcRenderer.send('save-url', body);

};

/**
 * Renders category and binds actions
 */
const render = categories => {

	categories.map(category => {
		const categoryActive = category._id == categoryId ? ' selected' : '';
		$('#category').append(`<option value="${category._id}"${categoryActive}>${category.title}</option>`);
	});

};

ipcRenderer.on('on-data', (event, data) => {

	categories = data[0];
	urls = data[1];

	render(categories);

	const bookmark = urls.length > 0 && bookmarkId ? urls[0] : null;
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