/** Filters functionality for the Event Map page
* @see {@link https://nbto.com/program/event-map.html|Event Map Page}
* @module Filters
* @requires Map
* @requires array.includes (IE9 polyfill)
*/

import Maps from "./_Snb.Map";
require('core-js/fn/array/includes'); //IE9 needs a Array.includes polyfill

let exports = module.exports = {};

let filters = {
		active: [],
		inactive: []
	};

let areFiltersActive = false;
let filterContainer, inputs, activeFiltersContainer;



/** 
*	<p>Grabs the neccessary HTML and inputs and assigns click events:</p>
*	<ul>
*	<li>filterContainer: the HTML element that has all the filter checkboxes<ul><li>Adds onclick event to this container (ex: any filter checkbox is clicked)</li></ul></li>
*	<li>inputs: an array of inputs (checkboxes) inside filterContainer</li>
*	<li>activeFiltersContainer: div that holds the current filters selected<ul><li>Adds onclick event to this container that removes the filter from the container as well as unchecks it in the dropdown above it</li></ul></li>
*	</ul>
*	<p>Also activates onclick event for the 'select all' button in the filters dropdown.
*	@fires {@link updateFilters} - Every time a filter is selected/deselected or the select all button is pressed or a button inside the active filters div is pressed
*/
exports.initFilters = () => {

	filterContainer = document.getElementById('js--filter-container'),
	inputs = filterContainer.getElementsByTagName('input'),
	activeFiltersContainer = document.getElementById('active-filter-list');

	//sorting each filter into filters object
	for(let i = 0, j = inputs.length; i < j; i++) {

		let value = inputs[i].value;

		filters.inactive.push(value); 
	}


	//if any checkbox in the filters list is clicked, 
	//send it to the update function
	filterContainer.onclick = (evt) => {
		let event = evt || window.event;
        let target = event.target || event.srcElement;

        //if target doesn't have a value (is not a checkbox)
        //don't do anything
        if(target.value === 'undefined' || !target.value)
        	return;

        updateFilters([target.value], false);
	}

	//if view all button is clicked
	document.getElementById('js--filter-select-all').onclick = (evt) => {
		let checkAll = [];
		for(let i = 0, j = inputs.length; i < j; i++) {
			inputs[i].checked = true;
			checkAll.push(inputs[i].value);
		}

		updateFilters(checkAll, true);
	}

	activeFiltersContainer.onclick = (evt) =>{
		let event = evt || window.event,
        	target = event.target || event.srcElement;

        if(target.tagName !== 'BUTTON')
        	return;

        let filterValue = target.getAttributeNode('filter').value;

        
        document.querySelector(`input[value="${filterValue}"]`).checked = false;
        target.parentElement.removeChild(target);


        updateFilters([filterValue], false);




	}
};

/** 
*	<p>Runs internal function updateTiles</p>
*	@fires {@link updateTiles}
*/
exports.updateTileFilters = () => {
	updateTiles();
}


/** 
*	<p>Takes the values passed in and moves that filter into the filters.active object if previously inactive or the filters.inactive object if previously active.</br>
*	If 'ischeckAll' is true, will move everything into the filters.active object. Fires all funcions listed below to modify the DOM to reflect these changes.</p>
*	@param {Array} value - An array of the filter value(s) that have been selected/unselected
*	@param {boolean} ischeckAll - True/False if it came from the 'isCheckAll' button
*	@fires {@link updateTiles}
*	@fires {@link updateMapMarkers}
*	@fires {@link updateFilterList}
*/
function updateFilters(value = [], ischeckAll = false) {
	let added = [],
		removed = [];

		if(ischeckAll){
			for(let i = 0, j = filters.inactive.length; i < j; i++){
				filters.active.push(filters.inactive[i]);
				added.push(filters.inactive[i]);
			}
			filters.inactive = [];
			updateTiles();
			updateMapMarkers();
			updateFilterList(added, removed);
			return;
		}

	//adding or removing
	for(let i = 0, j = value.length; i < j; i++){
		let filter = value[i];
			

		if(filters.active.includes(filter)){
			let index = filters.active.indexOf(filter);
			filters.inactive.push(filter);
			filters.active.splice(index, 1);
			removed.push(filter);
		}else{
			let index = filters.inactive.indexOf(filter);
			filters.active.push(filter);
			filters.inactive.splice(index, 1);
			added.push(filter);
		}
	}

	updateTiles();
	updateMapMarkers();
	updateFilterList(added, removed);

}


/** 
*	<p>Gets all map markers and creates new Google maps bounds. If no filters are active we show all the markers. If not, this function shows/hides map markers based on filters.active object<br/>
	If found, marker gets added to the new Google Maps bounds and once all markers are checked a new bounds is created around only the visible markers.</p>
*	@fires {@link matchFilter} - if active filters are more than 0, this function checks for a match.
*	@fires {@link module:Map.getMarkers}
*	@fires {@link module:Map.reDrawMapBounds}
*/
function updateMapMarkers() {

	let markers = Maps.getMarkers();
	let bounds = new google.maps.LatLngBounds();

	if(markers.length === 0)
		return;

	markers.forEach((marker) => {
		let labels = marker.labelClass;

		if(filters.active.length === 0){
			marker.setVisible(true);
			bounds.extend(marker.position);
			return;
		}

		if(matchFilter(labels)){
			marker.setVisible(true);
			bounds.extend(marker.position);
		}else{
			marker.setVisible(false);
		}
	});


	Maps.reDrawMapBounds(bounds);

}


/** 
*	<p>Grabs the list of tiles from the HTML (.project-list-tile). Removes the CSS classes last and even from the tile. If no filters are active, we show all tiles so we remove the hide class as well.<br/>
*	If more than one filter, and the tile matches any active filters, we remove the hide class. If not, we add the hide class if it didn't exist already.<br/>
*	Before we're finished we add the class 'last' to every fourth tile and the class 'eve' to every second tile (for CSS purposes)</p>
*	@fires {@link matchFilter} - if active filters are more than 0, this function checks for a match.
*/
function updateTiles() {

	let tiles = document.getElementsByClassName('project-list-tile');

	if(tiles.length === 0)
		return;


	for(let i = 0, j = tiles.length; i < j; i++) {
		let tile = tiles[i];
		let labels = tile.getAttributeNode('project-type').value;

		//remove the last and even class if it exists
		tile.className = tile.className.replace(/\b\slast\b/, "");
		tile.className = tile.className.replace(/\b\seven\b/, "");

		//if no filters are active.. show all projects so remove hide class
		if(filters.active.length === 0){
			tile.className = tile.className.replace(/\b\shide\b/, "");
			continue;
		}

		
		if(matchFilter(labels)){
			tile.className = tile.className.replace(/\b\shide\b/, "");
		}else{
			if(tile.className.indexOf('hide') === -1){
				tile.className += ' hide';
			}
		}

	};

	let shownTiles = document.querySelectorAll('.project-list-tile:not(.hide)');


	for(let i = 3, j = shownTiles.length; i < j; i+= 4) {
		shownTiles[i].className += ' last'; 
	}

	for(let i = 1, j = shownTiles.length; i < j; i+= 2) {
		shownTiles[i].className += ' even'; 
	}

	return true;
}


/** 
*	<p>Runs a for loop on each element in the filters.active object. In each iteration it checks to see if that value is anywhere in the 'labels' string passed.<br/>
*	Since we only need one match to show, it will return true immediatley after a match is found.</p>
*	@param {String} labels - The string of categories this project falls under
*	@return {Boolean} If match is found (TRUE), if not (FALSE)
*/
function matchFilter(labels){
	for(let i = 0, j = filters.active.length; i < j; i++){
		let filter = filters.active[i];

		if(labels.indexOf(filter) > -1){
			return true;
		}
	}
	return false;
}

/** 
*	<p>If a filter is set to active, we need to show that in div (activeFiltersContainer). We create a button that displays highlighting tha filters are active.<br/>
	If a filter is being set to inactive, we need to remove this button from the HTML div and hide the div if no filters are active.</p>
*	@param {Array} added - The array of filters being set to active 
*	@param {Array} removed - The array of filters being set to inactive
*/
function updateFilterList(added, removed) {

	added.forEach((el) => {
		let element = document.querySelector(`input[value="${el}"]`),
			label = document.querySelector(`label[for="${element.id}"]`).innerHTML;
		
		let buttonEl = document.createElement('button');
		buttonEl.className = `filter-list-btn ${el}`;
		buttonEl.innerText = label;
		buttonEl.setAttribute('filter', `${el}`);

		activeFiltersContainer.appendChild(buttonEl);
		activeFiltersContainer.className = "";

	});

	removed.forEach((el) => {
	let filterButton = document.querySelector(`button[filter="${el}"]`);
        if(filterButton){
        	filterButton.parentElement.removeChild(filterButton);
        }
	});

	if(activeFiltersContainer.getElementsByTagName('button').length === 0){
		activeFiltersContainer.className = "hide";
	} 
}


