/** <p>The Main Desktop Controller</p>
*	<p>This works by paring a variable called jsNeeded (coming from the HTML) object and running the scripts based on what is needed for that page.<br/>
*	Each page will have a different value for the variable jsNeeded and for the variable page_id hardcoded in the &lt;head&gt; tag of the document.
*	@example
*	// Will run ReadMore and Tiles functionality
*	var page_id = 256;
*	var jsNeeded = {"tiles":true,"readmore":true};
*	@module Nb.Main
*	@requires Navigation
*	@requires ProgramPage
*	@requires Map
*	@requires Tiles
*	@requires Gallery
*	@requires ReadMore
*/


import Navigation from "./_Snb.Navigation";
import ProgramPage from "./_Snb.ProgramPage";
import Maps from "./_Snb.Map";
import Tiles from "./_Snb.Tiles";
import Gallery from "./_Snb.Gallery";
import ReadMore from "./_Snb.ReadMore";



Navigation.initNavigation();



//jsNeeded is a variable comes from MODX.. it is an object that gets created in root
//and tells us what functionality is needed.. instead of running anything


/** if the page needs gallery functionality init it (home page only) */
if(jsNeeded.hasOwnProperty('gallery') && jsNeeded['gallery'] === true){
	Gallery.initGallery();
}

//if page needs read more functionality init it (curators page only)
if(jsNeeded.hasOwnProperty('readmore') && jsNeeded['readmore'] === true){
	ReadMore.initReadMore();
}

//if we need a map init that
if(jsNeeded.hasOwnProperty('map') && jsNeeded['map'] === true){
	Maps.init();
	//project details page needs just the one point that's 
	//directly on the page in a hidden input
	if(document.getElementById('proj_lat') && document.getElementById('proj_lng')){
		Maps.setSingleMarker(document.getElementById('proj_lat').value, document.getElementById('proj_lng').value);
	}
}

//if tiles is set only and NOT map
if((jsNeeded.hasOwnProperty('tiles') && jsNeeded['tiles'] === true) && (!jsNeeded.hasOwnProperty('map') && jsNeeded['map'] !== true)){
	Tiles.init();
}

//if maps and tiles are both set, its the program (event map) page
if((jsNeeded.hasOwnProperty('tiles') && jsNeeded['tiles'] === true) && (jsNeeded.hasOwnProperty('map') && jsNeeded['map'] === true)){
	ProgramPage.init();
}









