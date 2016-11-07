/** The Google Maps functionality
* @module Map
* @requires Google
* @requires MarkerWithLabel
*/


const google = require('google');
let MarkerWithLabel = require('markerwithlabel')(google.maps);

let exports = module.exports = {};

//setting up variables
let map = {},
	InfoWindow,
	markerList = [],
	previousCenter,
	previousZoom;

let mapContainer = document.getElementById('js-map-container');

//google maps styles
const styles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];


/** 
*	<p>Creates a new Google maps inside variable mapContainer</p>
*	<p>Also creates an InfoWindow as well and adds a 'close click' event to it.</p>
*/
exports.init = () => {
    InfoWindow = new google.maps.InfoWindow();
	 map = new google.maps.Map(mapContainer, {
	    center: {
	        lat:  43.6584479152987,
	        lng: -79.38455242920877
	    },
	    zoom: 13,
	    minZoom: 5,
	    maxZoom:20,
	    streetViewControl : false,
	    mapTypeControl : false
	});

	map.set('styles', styles);

	google.maps.event.addListener(InfoWindow, "closeclick", () => {
		map.setCenter(previousCenter);
		map.setZoom(previousZoom);
	});


	return true;
}	


/** 
*	<p>Takes the JSON project data and one by one runs the setMarker function (after parsing filter array into a string)<br/>
*	After the loop is finished it redraws the map bounds based on the markers in the map</p>
*	@param {Object} projects - The JSON object of the projects list
*	@fires {@link setMarker} - For each project
*/
exports.setMarkers = (projects) => {

	Object.keys(projects).forEach((key) => {
		let project = projects[key],
			filters = '';

		for(let j in project.filters){
			filters += `${project.filters[j]} `;
		}
		filters = filters.substring(0, filters.length - 1);

		setMarker(project.title, project.lat, project.lng, project.map_icon, filters, project.map_content, project.infowindow);
	});

	//setting the map location to show all points
	let bounds = new google.maps.LatLngBounds();
	for(let i = 0, j = markerList.length; i < j; i++){
		bounds.extend(markerList[i].position);
	}
	map.fitBounds(bounds);
}


/** 
*	<p>Re-draws map bounds based on bounds passed into the function.</p>
*	@param {Object} bounds - The Google maps bounds object
*	@see {@link https://developers.google.com/maps/documentation/javascript/reference| Google Maps LatLng Documentation} for more.
*/
exports.reDrawMapBounds = (bounds) => {
	if(!bounds.isEmpty()){
		map.fitBounds(bounds);
	}
	return true;
}


/** 
*	<p>Sets a single marker on the google map<br/>
*	will also center the map to this location.
*	used for the details page on desktop.</p>
*	@param {string} lat - Latitude of the marker
*	@param {string} lng - Longitude of the marker
*/
exports.setSingleMarker = (lat, lng) => {

	let marker = new MarkerWithLabel({
        position: new google.maps.LatLng(lat, lng),
        map: map
    });

	map.setCenter(marker.position);

}

/** 
*	<p>Draws the legend for the desktop map page.<br/>
*	Legend is hard-coded, and is placed in top-left corner.</p>
*/
exports.drawLegend = () => {
	let legend = document.createElement('div');
	legend.id = 'legend';
	legend.innerHTML = `
		<h4>Legend</h4>
        <span class="legend-item curator4">OBLIVION</span>
		<span class="legend-item curator1">Militant Nostalgia</span>
        <span class="legend-item curator2">And the Transformation Reveals</span>
        <span class="legend-item curator3">Facing the Sky</span>
        <span class="legend-item independent-project">Independent Projects</span>
        <span class="legend-item major-institutions">Major Institutions</span>
        <span class="legend-item sponsor-project">Special Projects</span>
        <span><img src="/assets/images/Icons/info_centres.png" />Event Centre</span>
        <span class="legend-item star">Invictus 360°</span>
	`;

	map.controls[google.maps.ControlPosition.TOP_LEFT].push(legend);
	return true;
}


/** 
*	<p>Gets the contents of the variable markerList</p>
*	@return {Object} markerList - a list of all markers added to the map
*/
exports.getMarkers = () => {
	return markerList;
}


/** 
*	<p>Gets the contents of the variable map</p>
*	@return {Object} map - the Google maps object
*/
exports.getMap = () => {
	return map;
}	


/** 
*	<p>Takes the variable markerList and recreates a new LatLngBounds for the map based on which markers are visible (after filters are applied)</p>
*	@see {@link https://developers.google.com/maps/documentation/javascript/reference| Google Maps LatLng Documentation} for more.
*/
exports.redrawMap = () => {
	let bounds = new google.maps.LatLngBounds();

	markerList.forEach((marker) => {
		if(marker.getVisible()){
			bounds.extend(marker.position);
		}
	});
	
	map.fitBounds(bounds);
	return true;
}	


/** 
*	<p>sets an individual point (MarkerWithLabel) onto the Google map (variable map)<br/>Adds a click even to open the infowindow.<br/>Pushes marker into variable 'markerList'.</p>
*	@param {string} title - Title of the marker
*	@param {string} lat - Latitude of the marker
*	@param {string} lng - Longitude of the marker
*	@param {string} icon - Icon for the marker (either an img string or spacer img with HTML content)
*	@param {string} filters - string of filters to put into the marker class
*	@param {string} content - what appears inside the icon (if any)
*	@param {string} infoContent - HTML to appear in the pop-up when icon clicked.
*/
function setMarker(title, lat, lng, icon, filters, content, infoContent){

	let marker = new MarkerWithLabel({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            icon: icon,
            title: title,
            labelContent: content,
            labelAnchor: new google.maps.Point(8, 18),
            labelClass: filters
        });


  	marker.addListener('click', () => {
  	previousCenter = map.getCenter();
	previousZoom = map.getZoom();
	
    	map.setZoom(18);
    	map.setCenter(marker.getPosition());
    	
    	InfoWindow.setContent(infoContent);

    	InfoWindow.open(map, marker);

  	});

  	//add it to the list of all markers
  	markerList.push(marker);
}


