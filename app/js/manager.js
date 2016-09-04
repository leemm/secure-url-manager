/**
 * Handles Table Management
 */

const { ipcRenderer } = require('electron'),
	_ = require('lodash');

let categories = [], urls = [], selectedCategoryId;

$( document ).ready(() => {

	loadData();
	bindToolbar();

});

const monitor = {
	get: function(target, property) {
		return target[property];
	},
	set: function(target, property, value, receiver) {
		console.log(target);
		console.log(property);
		console.log(value);

		target[property] = value;

		return true;
	}
}

let selected = new Proxy([], monitor);

/**
 * Bind toolbar buttons
 */
const bindToolbar = () => {

	$('#button-add').click(ev => {
		ev.preventDefault();
		ipcRenderer.send('add-edit', { category: selectedCategoryId });
	});

	$('#button-edit').addClass('inactive').click(function(ev) {
		ev.preventDefault();

		if (!$(this).hasClass('inactive')){
			ipcRenderer.send('add-edit', { id: selected[0], category: selectedCategoryId });
		}
	});

	$('#button-delete').addClass('inactive').click(function(ev) {
		ev.preventDefault();

		if (!$(this).hasClass('inactive')){

			// If multiselect delete them all
            if (selected.length > 1){

                if (confirm('Are you sure you want to delete these bookmarks?')){
                    ipcRenderer.send('delete-url', selected);
                }

            }else{
                if (confirm('Are you sure you want to delete this bookmark?')){
                    ipcRenderer.send('delete-url', { _id: selected[0] });
                }
            }

		}
	});

	// Find filter box
	$('#find').keyup(function(ev){
		clear();

		let searchElement = $(this),
			filter = searchElement.val().length > 0 ? { title: searchElement.val(), url: searchElement.val() } : {}

		selectedCategoryId = null;
		clear(true);
		loadData(filter);
	});

}

/**
 * Query data from database
 */
const loadData = filter => {

	ipcRenderer.send('data', filter);

}

/**
 * Toolbar turn edit and delete on
 */
const toolbarStatus = on => {

	ipcRenderer.send('toolbarStatus', on);

}

/**
 * Clear tables/lists
 */
const clear = includeCategories => {

	// Clear exists
	if (includeCategories){ $('#category-list nav span.nav-group-item').remove(); }
	$('#url-list tbody tr').empty();

}

/**
 * Render tables/lists based on returned data
 */
const render = () => {

	// Build lists
	if ($('span.nav-group-item').length === 0){
		categories.map(category => {
			let newCategory = $(`<span data-id="${category._id}" class="nav-group-item"><span class="icon icon-list"></span>${category.title}</span>`);

			if (category._id === selectedCategoryId){ newCategory.first().addClass('active'); }

	        $('#category-list nav').append(newCategory);
		});
	}

	urls.map(url => {
        $('#url-list tbody').append(`<tr data-id="${url._id}" class="bookmark"><td>${url.title}</td><td title="${url.url}">${url.url}</td><td>${url.category}</td><td>${moment(url.date_added).format('dddd, MMMM Do YYYY')}</td></tr>`);
	});

	bind();

};

ipcRenderer.on('on-data', (event, data) => {

	categories = data[0];
	urls = data[1];

	for (let idx = 0;idx < urls.length;idx ++){
		let thisCategory = _.find(categories, { _id: urls[idx].category_id });
		urls[idx].category = thisCategory ? thisCategory.title : '';
	}

	render();

});

ipcRenderer.on('reload', (event, isCategory) => {

	let filter = {};
	if (selectedCategoryId){ filter.category_id = selectedCategoryId; }

	clear(isCategory);
	loadData(filter);

});

ipcRenderer.on('toolbarStatus', (event, count) => {

	let edit = $('#button-edit'),
		del = $('#button-delete');

	edit.addClass('inactive');
	del.addClass('inactive');

	if (count === 1){ edit.removeClass('inactive'); }
	if (count >= 1){ del.removeClass('inactive'); }

});

ipcRenderer.on('on-error', (event, err) => {
	console.log('error detected');
	console.error(err);
	alert('There has been a fatal error loading your urls, please restart the application and try again.');
});


/**
 * Binds events to table
 */
const bind = () => {

	// Categories
	$('#category-list nav span.nav-group-item').unbind().click(function(e) {
		e.preventDefault();

		let clickOff = selectedCategoryId && $(this).hasClass('active');

		selectedCategoryId = $(this).attr('data-id');

		// Set on status
		$('span.nav-group-item').removeClass('active');

		let navItem = $('span.nav-group-item[data-id="' + selectedCategoryId + '"]');
		if (clickOff){
			selectedCategoryId = null;
		} else {
			navItem.addClass('active');
		}

		clear();

		let filter = {};
		if (selectedCategoryId){ filter.category_id = selectedCategoryId; }

		loadData(filter);
	});

	// URL List
	$('#url-list tbody tr').unbind().click(function(e) {
		e.preventDefault();

		let id = $(this).attr('data-id');

		if (!e.shiftKey && !e.metaKey){ // Standard left-click

			addRemoveID(id, true);

		}else if (e.shiftKey){ // With shift held (i.e. from and to)

			if (selected.length > 0){

				selected = shiftedMultiSelect(id);

			}else{

				addRemoveID(id);

			}

		}else if (e.metaKey){ // With cmd held (multi-select)

			addRemoveID(id);

		}

		setURLStatus();
		toolbarStatus(selected.length);

	}).dblclick(function(e) {
		e.preventDefault();

		selected = [];
		setURLStatus();

		alert('double');
	});

};

/**
 * Sets active status on category
 */
const setCategoryStatus = id => {

	if (id){
		$('#category-list nav span').removeClass('active');
		$('#category-list nav span[data-id="' + id + '"]').addClass('active');
	}

};

/**
 * Sets active status to table rows
 */
const setURLStatus = () => {

	$('#url-list tbody tr').removeClass('active');
	selected.map(id => {
		$('tr[data-id="' + id + '"]').addClass('active');
	});

}

/**
 * Add/Remove ID to selected array
 * @param  {String} id
 * @param  {Boolean} clear (optional)
 */
const addRemoveID = (id, clear) => {

	if (selected.indexOf(id) > -1){
		selected.splice(selected.indexOf(id), 1);
	}else{
		if (clear && clear === true){ selected = []; }
		selected.push(id);
	}

}

/**
 * When holding shift, finds the closest row to the selected row
 * @param  {String} id
 * @return {Array}
 */
const shiftedMultiSelect = id => {

	let tempArray = [],
		distanceArray = [],
		currentIndex = $('#url-list tbody tr[data-id="' + id + '"]').prevAll().length;

	selected.map(selectedId => {
		let selectedIdIndex = currentIndex - $('[data-id="' + selectedId + '"]').prevAll().length;

		distanceArray.push({ id: selectedId, length: Math.abs(selectedIdIndex) });
	});

	distanceArray.sort(function(a, b) { return a.length - b.length; }); // find the closest

	let first = false, last = false;
	$('#url-list tbody tr').each(function() {

		let tr = $(this);

		if (tr.attr('data-id') == id || tr.attr('data-id') == distanceArray[0].id){
			if (first){
				last = true;
				first = false;
			}else{
				first = true;
			}
		}

		if (first || last){
			tempArray.push(tr.attr('data-id'));
			last = false;
		}

	});

	return tempArray;

}