/** The Event Map Desktop Page functionality.
* @see {@link https://nbto.com/program/event-map.html|Event Map Page}
* @module ProgramPage
* @requires Tiles
* @requires Filters
* @requires Map
* @requires Data
*/

import Tiles from "./_Snb.Tiles";
import Filters from "./_Snb.Filters";
import Maps from "./_Snb.Map";
import Data from "./_Snb.GetJSON";

let exports = module.exports = {};

let projectList,
	loaded = false;	



/** 
*	<p>Init the functionality required for the ProgramPage.</p>
*	<p>Gets the project data from {@link module:Data| Data}</br>
*	Initializes the {@link module:Filters| Filters module}</br>
*	Initialized {@link module:Maps.drawLegend| Maps.drawLegend}</br>
*	{@link module:Maps.setMarkers| Maps.setMarkers} is fired after Data is present</p>
*	@fires {@link module:Filters.initFilters| Filters.initFilters} - Right away
*	@fires {@link module:Maps.drawLegend| Maps.drawLegend} - Right away
*	@fires {@link setMapAndListViewClicks} - Right away
*	@fires setFilterButtonClick - Right away
*	@fires {@link module:Maps.setMarkers| Maps.setMarkers} - after Data is provided
*	@fires {@link module:ProgramPage.setProjects| ProgramPage.setProjects} - after Data is provided
*/
exports.init = () => {

	Data.getProjects(page_id)
	.then(function (projects) {
		projectList = exports.setProjects(projects);
		Maps.setMarkers(projects);
	})
	.catch(function(err) {
  		console.log(err);
	});

	Filters.initFilters();
	Maps.drawLegend();

	setMapAndListViewClicks();
	setFilterButtonClick();
}	

/** Clones project data to allow mutation while keeping original intact.
*	@param {Object} data - The JSON object of the projects list
*	@return {Object} data - cloned JSON object of the projects list passed
*/
exports.setProjects = (data) => {
	return JSON.parse(JSON.stringify(data));
}

/** @function initTiles
*	@description Initialize the tile view on the Program Page.
*	A timeout checks to see if the data exists before passing 
*	to the {@link module:Tiles| Tiles} module.
*/
function initTiles() {
	//set an interval to wait for the projects to exist, then init the tiles.
	let timeout = setInterval(() => { 
		if(typeof projectList !== 'undefined'){

			//take out the static markers for the list view (they dont have project types)
			for(let project in projectList) {
   				if(!projectList[project].project_type){
   					projectList[project] = null;
   				}
			}

			clearInterval(timeout);
			Tiles.createTiles(projectList);
			Filters.updateTileFilters();

		}
			
	}  , 100);
}


/** @function
*	@description <p>Sets the onclick event to handle
*	the toggle between the Map View and the List View.
*	The toggle works by adding/removing CSS classes to the respective buttons</p>
*	<p>If the {@link @function initTiles| initTiles function} has not been run yet, it will run.</p>
*/
function setMapAndListViewClicks() {

	let mapButton = document.getElementById('map-view-btn'),
		listButton = document.getElementById('list-view-btn');

		mapButton.onclick = listButton.onclick = (evt) => {
		let event = evt || window.event,
	    	target = event.target || event.srcElement,
	    	showContainer = document.getElementById(target.attributes['data-show'].nodeValue),
	    	hideContainer = document.getElementById(target.attributes['data-hide'].nodeValue);

	    showContainer.className = '';
	    hideContainer.className = 'hide';

	    if(target === listButton){
	    	listButton.className = 'active';
	    	mapButton.className = mapButton.className.replace(/\bactive\b/, "");
	    }else{
	    	Maps.redrawMap();
	    	mapButton.className = 'active';
	    	listButton.className = listButton.className.replace(/\bactive\b/, "");

	    }

	    if(target === listButton && !loaded){
	    	loaded = true;
	    	initTiles();
	    }
	}
}

/** @function
*	@description Sets the onclick event to handle
*	the toggle between an open filters list and the closed state
*/
function setFilterButtonClick() {

	let filterButton = document.getElementById('toggle-filters-btn'),
		closeFilterContainer = document.getElementById('js--filter-close-filters');

	filterButton.onclick = closeFilterContainer.onclick = (evt) => {
		let event = evt || window.event,
        	target = event.target || event.srcElement,
        	filterContainer = document.getElementById('js--filter-container');

        if(filterContainer.className.indexOf('show-filters') === -1){
			filterContainer.className += ' show-filters';
		}else{
			filterContainer.className = filterContainer.className.replace(/\b\sshow-filters\b/, "");
		}
	}
}