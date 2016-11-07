//global vars are set in the templates to tell our JS 
//what functionality we need to init
//this acts as a rudementary controller file 
//that launches functionality based on what is needed 
//instead of everything on every page


//import "babel-polyfill"; // so big.. try and pull individual ones out (PROMISE, Array.includes)

import MobileNavigation from "./_Snb.MobileNavigation";
import JSON from "./_Snb.GetJSON";
import MobileMap from "./_Snb.MobileMap";
import MobileFilters from "./_Snb.MobileFilters";
import MobileIndexPage from "./_Snb.MobileIndexPage";
import MobileProjectPage from "./_Snb.MobileProjectPage";



//need Nav on every page so init it on every page
MobileNavigation.initNavigation();


if(jsNeeded.hasOwnProperty('mobileindex') && jsNeeded['mobileindex'] === true){
	MobileIndexPage.initIndexPage();
}

if(jsNeeded.hasOwnProperty('mobileproject') && jsNeeded['mobileproject'] === true){
	MobileProjectPage.initProjectPage();
}


//if we need a map init that, and map always needs JSON so start that as well.
if(jsNeeded.hasOwnProperty('map') && jsNeeded['map'] === true){
	let isNearMe = ((jsNeeded.hasOwnProperty('nearme') && jsNeeded['nearme'] === true) ? true : false);
	MobileMap.init(isNearMe);

	JSON.getProjects(page_id)
	.then(function (projects) {
		MobileMap.setMarkers(projects);
	})
	.catch(function(err) {
  		console.log(err);
	});
}

if(jsNeeded.hasOwnProperty('filters') && jsNeeded['filters'] === true){
	MobileFilters.initFilters();
}











