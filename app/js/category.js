/**
 * Handles Add/Edit Bookmark
 */

const { ipcRenderer } = require('electron'),
	_ = require('lodash'),
	querystring = require('querystring');

let categoryId;

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

		categoryId = qs.id;
		ipcRenderer.send('data');

	}

};

/**
 * Parse form data and close window (on close)
 */
const saveData = () => {

	let title = $('#title').val(),
		body = {
			title: title
		};

	if (categoryId){ body.categoryId = categoryId; }

	ipcRenderer.send('save-category', body);

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

	render(categories);

	const category = categories.length > 0 && categoryId ? _.find(categories, { _id: categoryId }) : null;
	if (category){

		$('#title').val(category.title);

	}

});

ipcRenderer.on('on-error', (event, err) => {
	console.error('err', err);
	alert('There has been a fatal error loading your bookmark, please restart the application and try again.');
});