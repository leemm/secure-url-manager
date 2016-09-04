const { remote } = require('electron');
const { Menu, MenuItem } = remote;

/**
 * Generate category context menu (if over category list)
 * @param  {Object} element
 * @return {Object} this menu
 */
const categoryMenu = element => {

    const overCategory = element.hasClass('nav-group-item'),
        id = element.attr('data-id'),
        menu = new Menu();

    menu.append(new MenuItem({
        label: 'Add',
        click(){
            ipcRenderer.send('add-edit-category');
        }
    }));

    menu.append(new MenuItem({
        label: 'Edit',
        enabled: overCategory,
        click(){
            ipcRenderer.send('add-edit-category', id);
        }
    }));

    menu.append(new MenuItem({
        label: 'Delete',
        enabled: overCategory,
        click(){
            if (confirm('Are you sure you want to delete this category?')){
                ipcRenderer.send('delete-category', { categoryId: id });
            }
        }
    }));

    return menu;

}

/**
 * Generate url context menu (if over url list)
 * @param  {Object} element
 * @return {Object} this menu
 */
const urlMenu = element => {

    // Category
    const categoryElement = $('#category-list nav .nav-group-item.active');
    categoryId = categoryElement.length > 0 ? categoryElement.attr('data-id') : null;

    const selected = $('.bookmark.active');


    element = element.prop('tagName').toLowerCase() === 'td' ? element.parent() : element;

    const overCategory = element.hasClass('bookmark'),
        id = element.attr('data-id'),
        menu = new Menu();

    menu.append(new MenuItem({
        label: 'Add',
        click(){
            ipcRenderer.send('add-edit', { category: categoryId });
        }
    }));

    menu.append(new MenuItem({
        label: 'Edit',
        enabled: overCategory && selected.length <= 1,
        click(){
            ipcRenderer.send('add-edit', { id: id, category: categoryId });
        }
    }));

    menu.append(new MenuItem({
        label: 'Delete',
        enabled: overCategory,
        click(){

            // If multiselect delete them all
            if (selected.length > 1){

                if (confirm('Are you sure you want to delete these bookmarks?')){

                    let bookmarkIds = [];
                    selected.each(function() {
                        bookmarkIds.push($(this).attr('data-id'));
                    });

                    ipcRenderer.send('delete-url', bookmarkIds);
                }

            }else{
                if (confirm('Are you sure you want to delete this bookmark?')){
                    ipcRenderer.send('delete-url', { _id: id });
                }
            }

        }
    }));

    return menu;

}

/**
 * Find if category or url menu is required
 * @param  {Object} mousePosition
 * @return {String}
 */
const findContainer = mousePosition => {
    let element = document.elementFromPoint(mousePosition.x, mousePosition.y);
    return $(element).closest('[id]').attr('id');
}

/**
 * Find element under mouse pointer
 * @param  {Object} mousePosition
 * @return {Object} jQuery Element
 */
const findElement = mousePosition => {
    let element = document.elementFromPoint(mousePosition.x, mousePosition.y);
    return $(element);
}

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    let id = findContainer({ x: e.x, y: e.y }),
        element = findElement({ x: e.x, y: e.y }),
        categoryPopup = categoryMenu(element),
        urlPopup = urlMenu(element);

    if (id === 'category-list'){
        categoryPopup.popup(remote.getCurrentWindow());
    }else if (id === 'url-list'){
        urlPopup.popup(remote.getCurrentWindow());
    }

}, false);
