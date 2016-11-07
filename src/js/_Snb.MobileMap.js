const google = require('google');
let MarkerWithLabel = require('markerwithlabel')(google.maps);

let exports = module.exports = {};


let map = {},
	userMarker = {},
	InfoWindow,
	markerList = [],
	previousCenter,
	previousZoom;

let mapContainer = document.getElementById('js-map-container');


const styles = [{"featureType":"water","elementType":"geometry","stylers":[{"color":"#e9e9e9"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#333333"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]}];


exports.init = (nearMe) => {
    InfoWindow = new google.maps.InfoWindow();
	 map = new google.maps.Map(mapContainer, {
	    center: {
	        lat:  43.6584479152987,
	        lng: -79.38455242920877
	    },
	    zoom: 15,
	    minZoom: 5,
	    maxZoom:20,
	    streetViewControl : false,
	    scaleControl: false,
	    mapTypeControl : false,
	    zoomControl: false
	});

	map.set('styles', styles);


	google.maps.event.addListener(InfoWindow, "closeclick", () => {
		map.setCenter(previousCenter);
		map.setZoom(previousZoom);
	});

	if(nearMe){
		let pinpoint = document.createElement('i');
		pinpoint.className = "mobile-map ion-pinpoint";

		pinpoint.index = 1;
	    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(pinpoint);

		getLocation(true);
		startLocationMarker();

	    pinpoint.addEventListener('click', function() {
	    	if(Object.keys(userMarker).length > 0){
	      		map.setCenter(userMarker.getPosition());
	      		map.setZoom(15);
	      		bounceMarker();
	      	}
    	});
	}


	return true;
}	


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
	
	if(Object.keys(userMarker).length === 0){
		map.fitBounds(bounds);
	}
}


exports.reDrawMapBounds = (bounds) => {

	if(Object.keys(userMarker).length > 0){
		bounds.extend(userMarker.position);
	}

	if(!bounds.isEmpty()){
		map.fitBounds(bounds);
	}
	return true;
}


exports.getMarkers = () => {
	return markerList;
}

// exports.getMap = () => {
// 	return map;
// }	


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



function startLocationMarker(){
	setInterval(() => { 
		getLocation(false);
	}, 15000); //15 seconds
}


function getLocation(first) {
	if (navigator.geolocation) {

		navigator.geolocation.getCurrentPosition((position) => {

			let pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			plotLocation(pos.lat, pos.lng);

			if(first){
				map.setCenter(pos);
				map.setZoom(15);
				bounceMarker();
				first = false;
			}
		},(e) => {
			console.log(e.message);
		});
	}
}



function plotLocation(lat, lng){
	if(Object.keys(userMarker).length === 0 && userMarker.constructor === Object){
		userMarker = new google.maps.Marker({
			clickable:false,
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: 'green',
				strokeColor: 'green',
				scale: 8
			},
			shadow: null,
			zIndex: 900,
			map: map
		});
	}

	userMarker.setPosition(new google.maps.LatLng(lat, lng));

	return true;
}



function bounceMarker() {
	userMarker.setAnimation(google.maps.Animation.BOUNCE);
	setTimeout(function(){userMarker.setAnimation(null); }, 1500);
}