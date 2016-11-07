/** The Tiles View Module
 *	@module Tiles
 *	@requires Data
 *	@see See {@link https://nbto.com/program/art-projects/exhibitions/major-institutions.html| an example}
 */

import Data from "./_Snb.GetJSON";


var exports = module.exports = {};


/** 
*	<p>Makes a request to the Data module to grab project data. then runs the createTiles function.</p>
*	@fires {@link module:Data.getProjects}
*	@fires {@link module:Tiles.createTiles} - Once we get data returned from Promise
*/
exports.init = () => {

	Data.getProjects(page_id)
	.then(function (projects) {
		exports.createTiles(projects);
	})
	.catch(function(err) {
  		console.log(err);
	});
}


/** 
*	<p>Takes each project in the project JSON and creates an HTML 'tile' out of the data.<br/>
*	Tiles include the project image, title, artist and location. <br/>
*	Each text field is cut off at certain character limits to avoid differen't height tiles.</br>
*	Also links to the project details<br/>
*	Sets CSS classes for 'even' tiles as well as 'last (in row)' tiles for CSS purposes<br/>
*	Tiles also have project-type data attribute for filtering purposes.</p>
*	<p>If container div is not found on the page, one is created at the bottom of the content div.</p>
*	@param {Object} projects - The JSON object of the projects list
*/
exports.createTiles = (projects) => {

	for(let i in projects){

		let project = projects[i];

		//static markers get nulled out before this stage
		//don't do anything if its a null
		if(project === null)
			continue;

		let aTag = document.createElement('a');

		aTag.setAttribute('href', `/project.html?project_id=${project.project_id}`);

		let data = document.createAttribute('project-type');
		for(let j in project.filters){
			data.value += `${project.filters[j]} `;
		}

		//remove final trailing space
		data.value = data.value.substring(0, data.value.length - 1);
		aTag.setAttributeNode(data);


		aTag.className = `${project.zone} project-list-tile ${project.project_type}`;

		if(i % 4 === 3){
			aTag.className += ' last';
		}

		if(i % 2 !== 0){
			aTag.className += ' even';
		}


		if(project.title.length > 37)
			project.title = project.title.substring(0, 34) + '&#133;';


		if(project.artist.length > 40)
			project.artist = project.artist.substring(0, 37) + '&#133;';


		if(project.location.length > 40)
			project.location = project.location.substring(0, 37) + '&#133;';



		aTag.innerHTML = `
			<div class="img-container"><img src="${project.photo}" /></div> 
			<h3><div class="${project.project_type} ${project.zone}"><span>${project.map_number}</span></div> ${project.title}</h3>
			<p>${project.artist}</p>
			<p>${project.location}</p>
		`;

		if(document.getElementById('js-project-tiles')){
			document.getElementById('js-project-tiles').appendChild(aTag);
		}else{
			let div = document.createElement('div');
			div.id = "js-project-tiles";
			div.appendChild(aTag);
			document.getElementsByClassName('content')[0].appendChild(div);
		}
		
	}

	return true;
}

