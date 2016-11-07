/** The Read More functionality
 * @module ReadMore
 * @requires jQuery
 * @see {@link https://nbto.com/program/art-projects/curated-exhibitions/oblivion.html|A curator landing page} for an example.
 */

var exports = module.exports = {};

/** 
*	<p>Init the functionality required for the Read More button on Curator Landing pages.<br/>
	Switches 'Read More' to 'Read Less' on click. Changes icon respectively.</p>
*/
exports.initReadMore = () => {
	let readMoreBtn = document.getElementById('btn_readmore');
	readMoreBtn.innerHTML = `read more <i class="ion-arrow-down-b"></i>`;

	readMoreBtn.onclick = (evt) => {
		if($(".curator_biography") != ''){
			if($(".curator_biography").first().css("display") == "none"){
				readMoreBtn.innerHTML = `read less <i class="ion-arrow-up-b"></i>`;
			}else{
				readMoreBtn.innerHTML = `read more <i class="ion-arrow-down-b"></i>`;
			}
		}

		$(".curator_biography").slideToggle("fast"); 
	}
};




