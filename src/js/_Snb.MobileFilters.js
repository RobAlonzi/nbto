import Maps from "./_Snb.MobileMap";
require('core-js/fn/array/includes'); //IE9 needs a Array.includes polyfill

let exports = module.exports = {};

let filters = {
		active: [],
		inactive: []
	};

let areFiltersActive = false;


let filterContainer, inputs, activeFiltersContainer, filterButton, closeFilterContainer;


exports.initFilters = () => {


	filterContainer = document.getElementById('js--filter-container'),
	inputs = filterContainer.getElementsByTagName('input'),
	activeFiltersContainer = document.getElementById('active-filter-list'),
	filterButton = document.getElementById('toggle-filters-btn'),
	closeFilterContainer = document.getElementById('js--filter-close-filters');


	filterButton.onclick = closeFilterContainer.onclick = (evt) => {

		let event = evt || window.event,
        	target = event.target || event.srcElement;

        if(filterContainer.className.indexOf('show-filters') === -1){
			filterContainer.className += ' show-filters';
		}else{
			filterContainer.className = filterContainer.className.replace(/\b\sshow-filters\b/, "");
		}
	}

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


exports.updateTileFilters = () => {
	updateTiles();
}

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



function matchFilter(labels){
	for(let i = 0, j = filters.active.length; i < j; i++){
		let filter = filters.active[i];

		if(labels.indexOf(filter) > -1){
			return true;
		}
	}
	return false;
}

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


